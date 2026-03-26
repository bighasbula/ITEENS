import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ConvexHttpClient } from 'convex/browser'

import { ENABLE_AI_EVALUATION } from '@/lib/ai/aiToggle'
import { api } from '@/convex/_generated/api'

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
    const coachInput = await convex.query(api.submissions.getUserCoachInput, {
      userId,
      rangeDays,
    })

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
    return NextResponse.json(
      { enabled: true, error: 'Progress coach failed' } satisfies ProgressCoachResponse,
      { status: 500 },
    )
  }
}

