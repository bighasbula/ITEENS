'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CheckCircle, Clock, Trophy, ArrowLeft, Copy } from 'lucide-react';
import Link from 'next/link';
import { getProblemById, getIdealSolution } from '@/lib/problems';
import { SupportedLanguage } from '@/lib/judge0';
import { ENABLE_AI_EVALUATION } from '@/lib/ai/aiToggle';

interface SuccessData {
  problemId: string;
  language: SupportedLanguage;
  code: string;
  executionTime: string;
  memory: number;
  testCasesPassed: number;
  totalTestCases: number;
  timestamp: string;
  timeTaken?: number;
  hintsUsed?: number;
}

interface AiEvaluationResponse {
  enabled: boolean;
  efficiencyScore?: number;
  timeComplexity?: string;
  spaceComplexity?: string;
  keyIssues?: string[];
  recommendation?: string;
  improvedCode?: string;
  error?: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [idealSolution, setIdealSolution] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiEvaluationResponse | null>(null);

  useEffect(() => {
    // Get data from URL params (in a real app, this would come from the database)
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setSuccessData(parsedData);
        // Load ideal solution
        loadIdealSolution(parsedData);
      } catch (error) {
        console.error('Error parsing success data:', error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const loadIdealSolution = (data: SuccessData) => {
    try {
      // Get the problem details
      const problem = getProblemById(data.problemId);
      if (!problem) {
        setIdealSolution('Problem not found.');
        return;
      }
      
      // Use pre-stored ideal solution in the user's language
      setIdealSolution(getIdealSolution(problem, data.language));
    } catch (error) {
      console.error('Error loading ideal solution:', error);
      setIdealSolution('Unable to load ideal solution at this time.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  useEffect(() => {
    if (!ENABLE_AI_EVALUATION) return;
    if (!successData) return;
    if (!successData.problemId || !successData.language || !successData.code) return;

    const runEvaluation = async () => {
      setAiLoading(true);
      setAiResult(null);
      try {
        const res = await fetch('/api/ai/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problemId: successData.problemId,
            language: successData.language,
            code: successData.code,
          }),
        });

        const data = (await res.json()) as AiEvaluationResponse;
        setAiResult(data);
      } catch (e) {
        setAiResult({
          enabled: true,
          error: e instanceof Error ? e.message : 'Unknown error',
        });
      } finally {
        setAiLoading(false);
      }
    };

    void runEvaluation();
  }, [successData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Analyzing your solution...</p>
        </div>
      </div>
    );
  }

  if (!successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Success Data Found</h1>
          <Link href="/problems">
            <Button>Go Back to Problems</Button>
          </Link>
        </div>
      </div>
    );
  }

  const problem = getProblemById(successData.problemId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20 sm:pt-24 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 mr-2 sm:mr-3" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-gray-800">Congratulations!</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-700 font-body">
            You&apos;ve successfully solved &quot;{problem?.name || successData.problemId}&quot;
          </p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <Card className="bg-white shadow-sm border-border/50 card-hover">
            <CardHeader className="text-center pb-3">
              <CardTitle className="flex items-center justify-center text-sm sm:text-base font-heading">
                <Clock className="h-4 w-4 mr-1.5 text-blue-600" />
                <div className="text-gray-700">Time Taken</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl sm:text-3xl font-heading text-blue-600">
                {successData.timeTaken || 0}s
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-body">Total time</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-border/50 card-hover">
            <CardHeader className="text-center pb-3">
              <CardTitle className="flex items-center justify-center text-sm sm:text-base font-heading">
                <Trophy className="h-4 w-4 mr-1.5 text-yellow-600" />
                <div className="text-gray-700">Performance</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl sm:text-3xl font-heading text-yellow-600">
                {successData.executionTime}s
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-body">Execution time</p>
              <p className="text-xs sm:text-sm text-gray-700 font-body">{successData.memory}KB memory</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-border/50 card-hover">
            <CardHeader className="text-center pb-3">
              <CardTitle className="flex items-center justify-center text-sm sm:text-base font-heading">
                <CheckCircle className="h-4 w-4 mr-1.5 text-green-600" />
                <div className="text-gray-700">Test Cases</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl sm:text-3xl font-heading text-green-600">
                {successData.testCasesPassed}/{successData.totalTestCases}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-body">All tests passed</p>
            </CardContent>
          </Card>
        </div>

        {/* Problem Info */}
        {problem && (
          <Card className="bg-white shadow-sm border-border/50 mb-5 sm:mb-6 card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-heading">
                <div className="text-gray-700">{problem.name}</div>
                <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)} font-body`}>
                  {problem.difficulty}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-700 mb-3 font-body">{problem.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {problem.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-border/50 font-body text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Solution */}
        <Card className="bg-white shadow-sm border-border/50 mb-5 sm:mb-6 card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm sm:text-base font-heading">
              <div className="text-gray-700">Your Solution</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(successData.code)}
                className="flex items-center gap-1.5 h-8 text-xs sm:text-sm border-border/50 hover:scale-[1.02] transition-transform font-body"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-md overflow-x-auto">
              <pre className="text-xs sm:text-sm font-mono">{successData.code}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Ideal Solution */}
        <Card className="bg-white shadow-sm border-border/50 mb-5 sm:mb-6 card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base font-heading"><div className="text-gray-700">Ideal Solution</div></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-md overflow-x-auto">
              <pre className="text-xs sm:text-sm font-mono">{idealSolution}</pre>
            </div>
          </CardContent>
        </Card>

        {/* AI Evaluation */}
        <Card className="bg-white shadow-sm border-border/50 mb-5 sm:mb-6 card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base font-heading"><div className="text-gray-700">AI Performance Analysis</div></CardTitle>
          </CardHeader>
          <CardContent>
            {!ENABLE_AI_EVALUATION ? (
              <p className="text-xs sm:text-sm text-gray-700 font-body">
                AI evaluation is currently turned off in internal code to avoid token usage.
              </p>
            ) : aiLoading ? (
              <p className="text-xs sm:text-sm text-gray-700 font-body">Analyzing efficiency...</p>
            ) : aiResult?.error ? (
              <p className="text-xs sm:text-sm text-red-600 font-body">
                AI evaluation failed: {aiResult.error}
              </p>
            ) : aiResult && aiResult.enabled ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-sm sm:text-base font-heading">
                    <div className="text-gray-700">Efficiency Score:</div>{' '}
                    <span className="text-blue-600">
                      {typeof aiResult.efficiencyScore === 'number' ? aiResult.efficiencyScore : 'N/A'}/100
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-body">
                    {aiResult.timeComplexity ? `Time: ${aiResult.timeComplexity}` : ''}{aiResult.spaceComplexity ? ` • Space: ${aiResult.spaceComplexity}` : ''}
                  </div>
                </div>

                {aiResult.keyIssues && aiResult.keyIssues.length > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm font-heading mb-1"><div className="text-gray-700">Key Issues</div></p>
                    <div className="text-xs sm:text-sm text-red-700 space-y-1">
                      {aiResult.keyIssues.map((k, i) => (
                        <div key={i}>• {k}</div>
                      ))}
                    </div>
                  </div>
                )}

                {aiResult.recommendation && (
                  <div>
                    <p className="text-xs sm:text-sm font-heading mb-1"><div className="text-gray-700">Recommendation</div></p>
                    <p className="text-xs sm:text-sm text-gray-700">{aiResult.recommendation}</p>
                  </div>
                )}

                {aiResult.improvedCode && (
                  <div>
                    <p className="text-xs sm:text-sm font-heading mb-1"><div className="text-green-700">Better Way (Suggested Code)</div></p>
                    <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs sm:text-sm font-mono">{aiResult.improvedCode}</pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-700 font-body">
                AI evaluation is not available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center gap-2 sm:gap-3">
          <Link href="/problems">
            <Button variant="outline" className="flex items-center gap-1.5 text-sm h-9 hover:scale-[1.02] transition-transform border-border/50 font-body">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Problems
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="flex items-center gap-1.5 text-sm h-9 hover:scale-[1.02] transition-transform font-body">
              <Trophy className="h-3.5 w-3.5" />
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuccessPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white shadow-lg rounded-lg p-6">
              <div className="h-6 bg-muted rounded w-24 mx-auto mb-4 animate-pulse"></div>
              <div className="h-8 bg-muted rounded w-16 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessPageSkeleton />}>
      <SuccessPageContent />
    </Suspense>
  );
}
