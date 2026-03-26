import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ENABLE_AI_EVALUATION } from '@/lib/ai/aiToggle'
import { getProblemById, getIdealSolution } from '@/lib/problems'
import type { SupportedLanguage } from '@/lib/judge0'

type EvaluateRequest = {
  problemId: string
  language: SupportedLanguage
  code: string
}

type EvaluateResponse = {
  enabled: boolean
  efficiencyScore?: number
  timeComplexity?: string
  spaceComplexity?: string
  keyIssues?: string[]
  recommendation?: string
  improvedCode?: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    if (!ENABLE_AI_EVALUATION) {
      return NextResponse.json({ enabled: false } satisfies EvaluateResponse)
    }

    const body = (await request.json()) as EvaluateRequest
    const { problemId, language, code } = body

    const problem = getProblemById(problemId)
    if (!problem) {
      return NextResponse.json(
        { enabled: true, error: 'Problem not found' } satisfies EvaluateResponse,
        { status: 400 },
      )
    }

    const idealSolution = getIdealSolution(problem, language)

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { enabled: true, error: 'Missing OPENAI_API_KEY on server' } satisfies EvaluateResponse,
        { status: 500 },
      )
    }

    const openai = new OpenAI({ apiKey: openaiApiKey })

    const prompt = {
      problem: {
        name: problem.name,
        difficulty: problem.difficulty,
        description: problem.description,
        tags: problem.tags,
      },
      sample: {
        sampleInput: problem.sampleInput,
        sampleOutput: problem.sampleOutput,
      },
      idealSolution,
      userCode: code,
      requirements: {
        language,
        score: 'Efficiency score should rate algorithmic efficiency and how it uses constraints, not just correctness.',
      },
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are a senior competitive programmer and code reviewer. Evaluate the user solution efficiency and propose improvements. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content:
            'Analyze the following competitive programming problem and the user code. Return JSON with these fields: ' +
            '`efficiencyScore` (0-100), `timeComplexity` (string), `spaceComplexity` (string), `keyIssues` (array of strings), `recommendation` (string), and `improvedCode` (string in the same language). ' +
            'Consider algorithmic complexity, unnecessary work, and data structures. Do not change the overall intended functionality.\n\n' +
            JSON.stringify(prompt),
        },
      ],
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ enabled: true, error: 'No AI content returned' } satisfies EvaluateResponse, {
        status: 500,
      })
    }

    const parsed = JSON.parse(content) as Omit<EvaluateResponse, 'enabled' | 'error'> & { error?: string }

    return NextResponse.json({
      enabled: true,
      efficiencyScore: parsed.efficiencyScore,
      timeComplexity: parsed.timeComplexity,
      spaceComplexity: parsed.spaceComplexity,
      keyIssues: parsed.keyIssues,
      recommendation: parsed.recommendation,
      improvedCode: parsed.improvedCode,
    } satisfies EvaluateResponse)
  } catch (error) {
    console.error('AI evaluation error:', error)
    return NextResponse.json(
      { enabled: true, error: 'AI evaluation failed' } satisfies EvaluateResponse,
      { status: 500 },
    )
  }
}

