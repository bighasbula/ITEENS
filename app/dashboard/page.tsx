'use client';

import { useUser } from '@/lib/hooks/useUser';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Clock, 
  Brain, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { userId, isLoaded } = useUser();
  
  const userStats = useQuery(api.users.getUserStats, userId ? { userId } : "skip");
  const submissionStats = useQuery(api.submissions.getUserSubmissionStats, userId ? { userId } : "skip");
  const recentSubmissions = useQuery(api.submissions.getUserSubmissions, userId ? { userId } : "skip");

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to view your dashboard.</p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-accent" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Your Dashboard</h1>
          </div>
          <p className="text-lg sm:text-xl font-bold text-muted-foreground">Track your coding progress and achievements</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="font-semibold">Problems Solved</span>
              </div>
              <p className="text-3xl font-bold ">
                {userStats?.totalSolved || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-semibold">Current Streak</span>
              </div>
              <p className="text-3xl font-bold text-primary">
                {userStats?.currentStreak || 0}
              </p>
              <p className="text-sm text-muted-foreground font-semibold mt-1">consecutive days</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-secondary" />
                <span className="font-semibold">Success Rate</span>
              </div>
              <p className="text-3xl font-bold ">
                {submissionStats?.successRate || 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="font-semibold">Best Time</span>
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {userStats?.bestTime ? `${userStats.bestTime}s` : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                Submission Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Submissions:</span>
                  <span className="font-semibold">{submissionStats?.totalSubmissions || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Correct Submissions:</span>
                  <span className="font-semibold text-green-600">{submissionStats?.correctSubmissions || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Average Time:</span>
                  <span className="font-semibold">{submissionStats?.averageTime || 0}s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Username:</span>
                  <span className="font-semibold">{userStats?.username || 'Not set'}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Member Since:</span>
                  <span className="font-semibold">
                    {userStats?.joinedAt ? new Date(userStats.joinedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>User ID:</span>
                  <span className="font-mono text-xs text-gray-500">{userId}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions && recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {recentSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Badge className={submission.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {submission.isCorrect ? 'PASS' : 'FAIL'}
                      </Badge>
                      <span className="font-medium text-sm sm:text-base">Problem {submission.problemId}</span>
                      <span className="text-xs sm:text-sm text-gray-500">({submission.language})</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span>{submission.timeTaken}s</span>
                      <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Brain className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <p className="text-sm sm:text-base">No submissions yet. Start solving problems to see your progress!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link href="/problem">
            <Button className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Practice Problems
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
