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

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [idealSolution, setIdealSolution] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your solution...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Congratulations!</h1>
          </div>
          <p className="text-xl text-gray-600">
            You&apos;ve successfully solved &quot;{problem?.name || successData.problemId}&quot;
          </p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Time Taken
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {successData.timeTaken || 0}s
              </p>
              <p className="text-sm text-gray-500 mt-1">Total time</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {successData.executionTime}s
              </p>
              <p className="text-sm text-gray-500 mt-1">Execution time</p>
              <p className="text-sm text-gray-500">{successData.memory}KB memory</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Test Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {successData.testCasesPassed}/{successData.totalTestCases}
              </p>
              <p className="text-sm text-gray-500 mt-1">All tests passed</p>
            </CardContent>
          </Card>
        </div>

        {/* Problem Info */}
        {problem && (
          <Card className="bg-white shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {problem.name}
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{problem.description}</p>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Solution */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your Solution
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(successData.code)}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">{successData.code}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Ideal Solution */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Ideal Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">{idealSolution}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Link href="/problems">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Problems
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
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
