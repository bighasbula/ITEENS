import { NextRequest, NextResponse } from 'next/server';
import { Judge0Service } from '@/lib/judge0';

export async function POST(request: NextRequest) {
  try {
    const { source_code, language_id, stdin } = await request.json();

    // Execute the code using Judge0
    const result = await Judge0Service.executeCode(
      source_code,
      language_id,
      stdin
    );

    return NextResponse.json({
      status: { id: 3, description: 'Accepted' },
      stdout: result.output,
      stderr: result.error,
      time: result.executionTime,
      memory: result.memory
    });
  } catch (error) {
    console.error('Judge0 submission error:', error);
    return NextResponse.json(
      { error: 'Failed to execute code' },
      { status: 500 }
    );
  }
}
