'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import CodeEditor from '@/components/CodeEditor';
import Terminal from '@/components/Terminal';
import ProblemDescription from '@/components/ProblemDescription';
import { Judge0Service, SupportedLanguage } from '@/lib/judge0';
import { getProblemById } from '@/lib/problems';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/hooks/useUser';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function ProblemPage() {
  const router = useRouter();
  const { userId } = useUser();
  const submitSolution = useMutation(api.submissions.submitSolution);
  
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [hintsUsed] = useState(0);

  // Get problem ID from URL params
  const searchParams = useSearchParams();
  const problemId = searchParams.get('id') || 'sleep-in'; // Default to sleep-in if no ID provided
  const problem = getProblemById(problemId);

  // Start timing when component mounts
  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  
  if (!problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Problem Not Found</h1>
          <p className="text-muted-foreground">The requested problem could not be found.</p>
        </div>
      </div>
    );
  }

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code first.');
      return;
    }

    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      // Use the first test case for running
      const testCase = problem.testCases[0];
      const result = await Judge0Service.executeCode(code, language, testCase.input);
      
      if (result.error) {
        setOutput(`Error: ${result.error}\n`);
      } else {
        setOutput(`Input: ${testCase.input}\nOutput: ${result.output}\nExpected: ${testCase.expectedOutput}\nExecution time: ${result.executionTime}s\nMemory: ${result.memory}KB`);
      }
    } catch (error) {
      setOutput(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code first.');
      return;
    }

    setIsRunning(true);
    setOutput('Running all test cases...\n');

    try {
      const testResults = await Judge0Service.testCode(
        code, 
        language, 
        problem.testCases
      );

      let outputText = `Test Results:\n`;
      outputText += `Passed: ${testResults.passed}/${testResults.total}\n\n`;

      testResults.results.forEach((result, index) => {
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        outputText += `Test Case ${index + 1}: ${status}\n`;
        outputText += `Input: ${result.input}\n`;
        outputText += `Expected: ${result.expectedOutput}\n`;
        outputText += `Actual: ${result.actualOutput}\n`;
        if (result.error) {
          outputText += `Error: ${result.error}\n`;
        }
        outputText += '\n';
      });

      if (testResults.passed === testResults.total) {
        outputText += '🎉 All test cases passed! Your solution is correct!\n';
        
        // Calculate time taken
        const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
        
        // Record submission in Convex
        if (userId) {
          try {
            await submitSolution({
              userId,
              problemId: problem.id,
              isCorrect: true,
              timeTaken,
              hintsUsed,
              code,
              language,
              executionTime: testResults.results[0]?.executionTime || '0.001',
              memory: testResults.results[0]?.memory || 0,
            });
          } catch (error) {
            console.error('Failed to record submission:', error);
          }
        }
        
        // Redirect to success page with data
        const successData = {
          problemId: problem.id,
          language: language,
          code: code,
          executionTime: testResults.results[0]?.executionTime || '0.001',
          memory: testResults.results[0]?.memory || 0,
          testCasesPassed: testResults.passed,
          totalTestCases: testResults.total,
          timestamp: new Date().toISOString(),
          timeTaken,
          hintsUsed,
        };
        
        const encodedData = encodeURIComponent(JSON.stringify(successData));
        router.push(`/success?data=${encodedData}`);
        return;
      } else {
        outputText += '❌ Some test cases failed. Please check your solution.\n';
        
        // Record failed submission in Convex
        if (userId) {
          try {
            await submitSolution({
              userId,
              problemId: problem.id,
              isCorrect: false,
              timeTaken: startTime ? Math.round((Date.now() - startTime) / 1000) : 0,
              hintsUsed,
              code,
              language,
            });
          } catch (error) {
            console.error('Failed to record submission:', error);
          }
        }
      }

      setOutput(outputText);
    } catch (error) {
      setOutput(`Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Problem Header */}
      <div className="border-b border-border bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/5">
        <div className="flex h-14 items-center px-4 gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{problem.name}</h1>
            <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full">{problem.difficulty}</span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : 'Run'}
            </Button>
            <Button 
              onClick={handleSubmitCode}
              disabled={isRunning}
            >
              {isRunning ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r overflow-auto">
          <ProblemDescription problem={problem} />
        </div>

        {/* Right Panel - Code Editor and Terminal */}
        <div className="w-1/2 flex flex-col">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">Code</TabsTrigger>
              <TabsTrigger value="terminal">Output</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 mt-0">
              <CodeEditor 
                language={language}
                value={code}
                onChange={setCode}
                defaultCode={problem.defaultCode[language]}
              />
            </TabsContent>
            
            <TabsContent value="terminal" className="flex-1 mt-0">
              <Terminal output={output} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
