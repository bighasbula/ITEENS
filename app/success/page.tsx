'use client';

import { useEffect, useState } from 'react';
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

export default function SuccessPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
                         <CheckCircle className="h-12 w-12 text-accent" />
             <h1 className="text-4xl font-bold text-foreground">Congratulations!</h1>
           </div>
           <p className="text-xl text-muted-foreground">
                           You&apos;ve successfully solved {successData && getProblemById(successData.problemId)?.name || 'the problem'}!
           </p>
        </div>

        {/* Problem Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                           <Trophy className="h-5 w-5 text-accent" />
             Problem Solved: {successData && getProblemById(successData.problemId)?.name || 'Unknown Problem'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
                             <Badge className={getDifficultyColor(successData && getProblemById(successData.problemId)?.difficulty || 'Easy')}>
                 {successData && getProblemById(successData.problemId)?.difficulty || 'Easy'}
               </Badge>
                             <span className="text-sm text-muted-foreground">Language: {successData.language}</span>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                                 <Clock className="h-5 w-5 text-primary" />
                 <span className="font-semibold">Execution Time</span>
               </div>
               <p className="text-2xl font-bold text-primary">{successData.executionTime}s</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Memory Usage</span>
              </div>
               <p className="text-2xl font-bold text-secondary">{successData.memory}KB</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                                 <CheckCircle className="h-5 w-5 text-accent" />
                 <span className="font-semibold">Test Cases</span>
               </div>
               <p className="text-2xl font-bold text-accent">
                 {successData.testCasesPassed}/{successData.totalTestCases}
               </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                                 <Clock className="h-5 w-5 text-primary" />
                 <span className="font-semibold">Solving Time</span>
               </div>
               <p className="text-2xl font-bold text-primary">
                 {successData.timeTaken ? `${successData.timeTaken}s` : 'N/A'}
               </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        {successData.hintsUsed !== undefined && (
          <div className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Hints Used</span>
                </div>
               <p className="text-2xl font-bold text-secondary">
                 {successData.hintsUsed}
               </p>
               <p className="text-sm text-muted-foreground mt-1">
                 {successData.hintsUsed === 0 ? 'Great job solving it independently!' : 'Hints can help guide your thinking'}
               </p>
              </CardContent>
            </Card>
          </div>
        )}

                {/* Ideal Solution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Ideal Solution
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(idealSolution)}
                className="ml-auto"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {idealSolution ? (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {idealSolution}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <span className="ml-2 text-muted-foreground">Loading solution...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Solution */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
              <pre>{successData.code}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
                     <Link href="/problems">
             <Button variant="outline" className="flex items-center gap-2">
               <ArrowLeft className="h-4 w-4" />
               Try Another Problem
             </Button>
           </Link>
                     <Link href="/dashboard">
             <Button className="flex items-center gap-2">
               <Trophy className="h-4 w-4" />
               Back to Dashboard
             </Button>
           </Link>
        </div>
      </div>
    </div>
  );
}
