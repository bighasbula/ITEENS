import axios from 'axios';
import { getJudge0Url, getJudge0Headers } from './judge0-config';

// Language IDs for Judge0
export const LANGUAGE_IDS = {
  python: 71,      // Python (3.8.1)
  javascript: 63,  // JavaScript (Node.js 12.14.0)
  java: 62,        // Java (OpenJDK 13.0.1)
  cpp: 54,         // C++ (GCC 9.2.0)
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_IDS;

interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

interface Judge0Response {
  token: string;
}

interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

export class Judge0Service {
  private static async submitCode(submission: Judge0Submission): Promise<string> {
    try {
      const response = await axios.post<Judge0Response>(
        `${getJudge0Url()}/submissions`,
        submission,
        {
          headers: getJudge0Headers(),
        }
      );
      return response.data.token;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw new Error('Failed to submit code for execution');
    }
  }

  private static async getResult(token: string): Promise<Judge0Result> {
    try {
      const response = await axios.get<Judge0Result>(
        `${getJudge0Url()}/submissions/${token}`,
        {
          headers: getJudge0Headers(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting result:', error);
      throw new Error('Failed to get execution result');
    }
  }

  private static async waitForResult(token: string, maxAttempts = 10): Promise<Judge0Result> {
    for (let i = 0; i < maxAttempts; i++) {
      const result = await this.getResult(token);
      
      // Status 1 = In Queue, Status 2 = Processing
      if (result.status.id !== 1 && result.status.id !== 2) {
        return result;
      }
      
      // Wait 1 second before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Execution timeout');
  }

  static async executeCode(
    code: string,
    language: SupportedLanguage,
    input?: string
  ): Promise<{
    output: string;
    error: string | null;
    executionTime: string;
    memory: number;
  }> {
    const languageId = LANGUAGE_IDS[language];
    
    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const submission: Judge0Submission = {
      source_code: code,
      language_id: languageId,
      stdin: input || '',
    };

    try {
      const token = await this.submitCode(submission);
      const result = await this.waitForResult(token);

      return {
        output: result.stdout || '',
        error: result.stderr || result.compile_output || result.message,
        executionTime: result.time,
        memory: result.memory,
      };
    } catch (error) {
      throw error;
    }
  }

  static async testCode(
    code: string,
    language: SupportedLanguage,
    testCases: Array<{ input: string; expectedOutput: string }>
  ): Promise<{
    passed: number;
    total: number;
    results: Array<{
      input: string;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
      error?: string;
      executionTime?: string;
      memory?: number;
    }>;
  }> {
    const results = [];
    let passed = 0;

    for (const testCase of testCases) {
      try {
        const result = await this.executeCode(code, language, testCase.input);
        
        const isPassed = result.output.trim() === testCase.expectedOutput.trim();
        if (isPassed) passed++;

        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: result.output,
          passed: isPassed,
          error: result.error || undefined,
          executionTime: result.executionTime,
          memory: result.memory,
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      passed,
      total: testCases.length,
      results,
    };
  }
}
