import { NextRequest, NextResponse } from 'next/server'
import { Judge0Service } from '@/lib/judge0'
import type { SupportedLanguage } from '@/lib/judge0'

export async function POST(request: NextRequest) {
  try {
    const { code, language, stdin } = await request.json() as {
      code: string
      language: SupportedLanguage
      stdin?: string
    }

    const result = await Judge0Service.executeCode(code, language, stdin)

    // Keep response shape simple for the client.
    return NextResponse.json({
      output: result.output,
      error: result.error,
      executionTime: result.executionTime,
      memory: result.memory,
    })
  } catch (error) {
    console.error('Judge0 execute error:', error)
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 },
    )
  }
}

