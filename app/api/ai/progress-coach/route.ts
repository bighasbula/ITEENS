import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ConvexHttpClient } from 'convex/browser'

import { ENABLE_AI_EVALUATION } from '@/lib/ai/aiToggle'
import { api } from '@/convex/_generated/api'
import { getProblemById } from '@/lib/problems'

type ProgressCoachRequest = {
  userId: string
  // Only support the windows we designed for to keep token usage bounded.
  rangeDays?: 7 | 30 | 90
}

type ProgressCoachResponse = {
  enabled: boolean
  progressScore?: number // 0-100
  streakCoaching?: {
    correlationHighlights?: string[]
    habitFixes?: string[]
  }
  efficiencyAnalysis?: {
    trend?: string
    targetedPractice?: string[]
  }
  languageStrategy?: {
    recommendedLanguageFocus?: string
    why?: string
    plan?: string[]
  }
  nextActions?: string[] // exactly 3 when present
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    if (!ENABLE_AI_EVALUATION) {
      return NextResponse.json({ enabled: false } satisfies ProgressCoachResponse)
    }

    const body = (await request.json()) as ProgressCoachRequest
    const { userId, rangeDays = 30 } = body

    if (!userId) {
      return NextResponse.json(
        { enabled: false, error: 'Missing userId' } satisfies ProgressCoachResponse,
        { status: 400 },
      )
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!convexUrl) {
      return NextResponse.json(
        { enabled: true, error: 'Missing NEXT_PUBLIC_CONVEX_URL on server' } satisfies ProgressCoachResponse,
        { status: 500 },
      )
    }

    const convex = new ConvexHttpClient(convexUrl)

    // IMPORTANT:
    // To avoid breaking prod when new Convex queries are not deployed yet,
    // compute coach input from existing queries/fields.
    let userSubmissions: Array<{
      submittedAt: number
      isCorrect: boolean
      timeTaken: number
      language?: string
      problemId: string
    }> = []

    try {
      userSubmissions = await convex.query(api.submissions.getUserSubmissions, { userId })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown Convex error'
      return NextResponse.json(
        { enabled: true, error: `Convex failed to fetch submissions: ${message}` } satisfies ProgressCoachResponse,
        { status: 500 },
      )
    }

    let user: { currentStreak: number; lastStreakUpdate?: number } | null = null
    try {
      user = await convex.query(api.users.getUserById, { userId })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown Convex error'
      return NextResponse.json(
        { enabled: true, error: `Convex failed to fetch user: ${message}` } satisfies ProgressCoachResponse,
        { status: 500 },
      )
    }

    const safeRangeDays: 7 | 30 | 90 = ([7, 30, 90] as const).includes(rangeDays as 7 | 30 | 90) ? (rangeDays as 7 | 30 | 90) : 30

    const dayMs = 24 * 60 * 60 * 1000
    const now = Date.now()

    // Use UTC day boundaries for stable day bucketing.
    const anchorDayStart = (() => {
      const d = new Date(now)
      d.setUTCHours(0, 0, 0, 0)
      return d.getTime()
    })()

    const rangeStart = anchorDayStart - (safeRangeDays - 1) * dayMs
    const rangeEndExclusive = anchorDayStart + dayMs

    const maxTake = safeRangeDays >= 90 ? 5000 : safeRangeDays >= 30 ? 3000 : 1500
    const recentSubmissions = userSubmissions.slice(0, maxTake)
    const submissionsInRange = recentSubmissions.filter(
      (s) => s.submittedAt >= rangeStart && s.submittedAt < rangeEndExclusive,
    )

    // Build daily series.
    const dailySeries = Array.from({ length: safeRangeDays }, (_, i) => {
      const dayStart = rangeStart + i * dayMs
      return {
        dayStart,
        totalSubmissions: 0,
        correctSubmissions: 0,
        successRate: 0, // percent
        avgCorrectTime: 0, // seconds
        dominantLanguage: null as string | null,
      }
    })

    const perDayCorrectSum = Array.from({ length: safeRangeDays }, () => 0)
    const perDayLang = Array.from({ length: safeRangeDays }, () => new Map<string, { submissions: number; correct: number; correctTimeSum: number }>())
    const submissionsByDay = Array.from({ length: safeRangeDays }, () => [] as typeof submissionsInRange)

    for (const s of submissionsInRange) {
      const idx = Math.floor((s.submittedAt - rangeStart) / dayMs)
      if (idx < 0 || idx >= safeRangeDays) continue

      dailySeries[idx].totalSubmissions += 1
      submissionsByDay[idx].push(s)

      if (s.isCorrect) {
        dailySeries[idx].correctSubmissions += 1
        perDayCorrectSum[idx] += s.timeTaken
      }

      const lang = s.language || 'unknown'
      const langStats = perDayLang[idx].get(lang) || { submissions: 0, correct: 0, correctTimeSum: 0 }
      langStats.submissions += 1
      if (s.isCorrect) {
        langStats.correct += 1
        langStats.correctTimeSum += s.timeTaken
      }
      perDayLang[idx].set(lang, langStats)
    }

    for (let i = 0; i < safeRangeDays; i++) {
      const attempts = dailySeries[i].totalSubmissions
      const correct = dailySeries[i].correctSubmissions

      if (attempts > 0) {
        dailySeries[i].successRate = Math.round((correct / attempts) * 10000) / 100
      }

      if (correct > 0) {
        dailySeries[i].avgCorrectTime = Math.round((perDayCorrectSum[i] / correct) * 100) / 100
      }

      // Dominant language by number of submissions for that day.
      let bestLang: string | null = null
      let bestCount = -1
      for (const [lang, st] of perDayLang[i]) {
        if (st.submissions > bestCount) {
          bestCount = st.submissions
          bestLang = lang
        }
      }
      dailySeries[i].dominantLanguage = bestLang
    }

    // Overall language breakdown.
    const langTotals = new Map<string, { submissions: number; correct: number; correctTimeSum: number }>()
    for (const s of submissionsInRange) {
      const lang = s.language || 'unknown'
      const st = langTotals.get(lang) || { submissions: 0, correct: 0, correctTimeSum: 0 }
      st.submissions += 1
      if (s.isCorrect) {
        st.correct += 1
        st.correctTimeSum += s.timeTaken
      }
      langTotals.set(lang, st)
    }

    const languageBreakdown = Array.from(langTotals.entries())
      .map(([language, st]) => {
        const successRate = st.submissions > 0 ? Math.round((st.correct / st.submissions) * 10000) / 100 : 0
        const avgCorrectTime = st.correct > 0 ? Math.round((st.correctTimeSum / st.correct) * 100) / 100 : 0
        return { language, submissions: st.submissions, correctSubmissions: st.correct, successRate, avgCorrectTime }
      })
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 6)

    // Top tags overall (computed via problem metadata).
    const tagTotals = new Map<string, { attempts: number; solves: number; correctTimeSum: number }>()
    for (const s of submissionsInRange) {
      const problem = getProblemById(s.problemId)
      if (!problem) continue
      for (const tag of problem.tags) {
        const st = tagTotals.get(tag) || { attempts: 0, solves: 0, correctTimeSum: 0 }
        st.attempts += 1
        if (s.isCorrect) {
          st.solves += 1
          st.correctTimeSum += s.timeTaken
        }
        tagTotals.set(tag, st)
      }
    }

    const topTags = Array.from(tagTotals.entries())
      .map(([tag, st]) => {
        const successRate = st.attempts > 0 ? Math.round((st.solves / st.attempts) * 10000) / 100 : 0
        const avgCorrectTime = st.solves > 0 ? Math.round((st.correctTimeSum / st.solves) * 100) / 100 : 0
        return { tag, attempts: st.attempts, solves: st.solves, successRate, avgCorrectTime }
      })
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 10)

    // “Streak drops” inside this range: days with 0 submissions after a day with >= 1.
    const breakDayIndices: number[] = []
    for (let i = 1; i < safeRangeDays; i++) {
      if (dailySeries[i].totalSubmissions === 0 && dailySeries[i - 1].totalSubmissions > 0) {
        breakDayIndices.push(i)
      }
    }

    const precedingDayIndices = breakDayIndices.map((i) => i - 1)

    const timesBeforeBreak: number[] = []
    const langBeforeBreak = new Map<string, number>()
    const tagBeforeBreak = new Map<string, number>()

    for (const dayIdx of precedingDayIndices) {
      if (dailySeries[dayIdx].correctSubmissions > 0) {
        timesBeforeBreak.push(dailySeries[dayIdx].avgCorrectTime)
      }

      for (const s of submissionsByDay[dayIdx]) {
        const lang = s.language || 'unknown'
        langBeforeBreak.set(lang, (langBeforeBreak.get(lang) || 0) + 1)

        const problem = getProblemById(s.problemId)
        if (!problem) continue
        for (const tag of problem.tags) {
          tagBeforeBreak.set(tag, (tagBeforeBreak.get(tag) || 0) + 1)
        }
      }
    }

    const avgCorrectTimeBeforeBreak =
      timesBeforeBreak.length > 0 ? Math.round((timesBeforeBreak.reduce((a, b) => a + b, 0) / timesBeforeBreak.length) * 100) / 100 : 0

    const languageBeforeBreakTop = Array.from(langBeforeBreak.entries())
      .map(([language, count]) => ({ language, submissions: count }))
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 4)

    const tagBeforeBreakTop = Array.from(tagBeforeBreak.entries())
      .map(([tag, mentions]) => ({ tag, mentions }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 6)

    const firstHalf = dailySeries.slice(0, Math.floor(safeRangeDays / 2)).filter((d) => d.correctSubmissions > 0)
    const lastHalf = dailySeries.slice(Math.floor(safeRangeDays / 2)).filter((d) => d.correctSubmissions > 0)

    const firstHalfAvg = firstHalf.length ? firstHalf.reduce((a, b) => a + b.avgCorrectTime, 0) / firstHalf.length : 0
    const lastHalfAvg = lastHalf.length ? lastHalf.reduce((a, b) => a + b.avgCorrectTime, 0) / lastHalf.length : 0

    const timeTrend =
      firstHalf.length === 0 || lastHalf.length === 0
        ? 'insufficient_data'
        : lastHalfAvg < firstHalfAvg
          ? 'improving'
          : lastHalfAvg > firstHalfAvg
            ? 'worsening'
            : 'flat'

    const totalSubmissions = submissionsInRange.length
    const correctSubmissions = submissionsInRange.filter((s) => s.isCorrect).length
    const successRate = totalSubmissions > 0 ? Math.round((correctSubmissions / totalSubmissions) * 10000) / 100 : 0
    const avgTimeAll =
      totalSubmissions > 0 ? Math.round((submissionsInRange.reduce((a, b) => a + b.timeTaken, 0) / totalSubmissions) * 100) / 100 : 0
    const avgCorrectTimeOverall =
      correctSubmissions > 0
        ? Math.round(
            (submissionsInRange.filter((s) => s.isCorrect).reduce((a, b) => a + b.timeTaken, 0) / correctSubmissions) * 100,
          ) / 100
        : 0

    const coachInput = {
      rangeDays: safeRangeDays,
      user: user ? { currentStreak: user.currentStreak, lastStreakUpdate: user.lastStreakUpdate } : null,
      totals: {
        totalSubmissions,
        correctSubmissions,
        successRate,
        avgTimeAll,
        avgCorrectTimeOverall,
      },
      languageBreakdown,
      topTags,
      streakDrops: {
        breakCountInRange: breakDayIndices.length,
        avgCorrectTimeBeforeBreak,
        languageBeforeBreakTop,
        tagBeforeBreakTop,
      },
      timeTrend: {
        trend: timeTrend,
        firstHalfAvgCorrectTime: Math.round(firstHalfAvg * 100) / 100,
        lastHalfAvgCorrectTime: Math.round(lastHalfAvg * 100) / 100,
      },
      // Keep dailySeries compact for token usage: only include successRate + avgCorrectTime + dominantLanguage.
      dailySeries: dailySeries.map((d) => ({
        dayStart: d.dayStart,
        successRate: d.successRate,
        avgCorrectTime: d.avgCorrectTime,
        dominantLanguage: d.dominantLanguage,
      })),
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { enabled: true, error: 'Missing OPENAI_API_KEY on server' } satisfies ProgressCoachResponse,
        { status: 500 },
      )
    }

    const openai = new OpenAI({ apiKey: openaiApiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an elite competitive programming coach. You will be given structured stats from a coding arena app. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content:
            'Using the provided `coachInput` JSON, produce a personalized progress coach.\n' +
            'Return ONLY this JSON shape:\n' +
            '{\n' +
            '  "enabled": true,\n' +
            '  "progressScore": number(0-100),\n' +
            '  "streakCoaching": {\n' +
            '    "correlationHighlights": string[],\n' +
            '    "habitFixes": string[]\n' +
            '  },\n' +
            '  "efficiencyAnalysis": {\n' +
            '    "trend": string,\n' +
            '    "targetedPractice": string[]\n' +
            '  },\n' +
            '  "languageStrategy": {\n' +
            '    "recommendedLanguageFocus": string,\n' +
            '    "why": string,\n' +
            '    "plan": string[]\n' +
            '  },\n' +
            '  "nextActions": string[] // EXACTLY 3 items\n' +
            '}\n\n' +
            'Rules:\n' +
            '- Keep explanations short and actionable.\n' +
            '- Ensure `nextActions` has exactly 3 strings.\n' +
            '- Use the stats (success rate, streak drops, avg times, language breakdown, topTags) as the basis.\n\n' +
            'coachInput=' +
            JSON.stringify(coachInput),
        },
      ],
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        { enabled: true, error: 'No AI content returned' } satisfies ProgressCoachResponse,
        { status: 500 },
      )
    }

    const parsed = JSON.parse(content) as Omit<ProgressCoachResponse, 'enabled' | 'error'> & {
      enabled?: boolean
      error?: string
    }

    // Defensive: keep contract stable for the UI.
    if (parsed.nextActions && Array.isArray(parsed.nextActions) && parsed.nextActions.length !== 3) {
      return NextResponse.json(
        { enabled: true, error: '`nextActions` must contain exactly 3 items' } satisfies ProgressCoachResponse,
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        enabled: true,
        ...parsed,
      } satisfies ProgressCoachResponse,
    )
  } catch (error) {
    console.error('Progress coach error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { enabled: true, error: `Progress coach failed: ${message}` } satisfies ProgressCoachResponse,
      { status: 500 },
    )
  }
}

