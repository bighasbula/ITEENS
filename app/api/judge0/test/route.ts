import { NextRequest, NextResponse } from 'next/server'
import { Judge0Service } from '@/lib/judge0'
import type { SupportedLanguage } from '@/lib/judge0'

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases } = await request.json() as {
      code: string
      language: SupportedLanguage
      testCases: Array<{ input: string; expectedOutput: string }>
    }

    const result = await Judge0Service.testCode(code, language, testCases)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Judge0 test error:', error)
    return NextResponse.json(
      { error: 'Failed to test code' },
      { status: 500 },
    )
  }
}

