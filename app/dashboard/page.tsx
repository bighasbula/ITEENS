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
  Zap,
  Sword,
  Crown
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { userId, isLoaded } = useUser();
  
  const userStats = useQuery(api.users.getUserStats, userId ? { userId } : "skip");
  const submissionStats = useQuery(api.submissions.getUserSubmissionStats, userId ? { userId } : "skip");
  const recentSubmissions = useQuery(api.submissions.getUserSubmissions, userId ? { userId } : "skip");
  const arenaStats = useQuery(api.matches.getUserArenaStats, userId ? { userId } : "skip");

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
    <div className="min-h-screen bg-background pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-foreground">Your Dashboard</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground font-body">Track your coding progress and achievements</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs sm:text-sm font-medium font-body text-muted-foreground">Problems Solved</span>
              </div>
              <p className="text-2xl sm:text-3xl font-heading text-foreground">
                {userStats?.totalSolved || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-xs sm:text-sm font-medium font-body text-muted-foreground">Current Streak</span>
              </div>
              <p className="text-2xl sm:text-3xl font-heading text-foreground">
                {userStats?.currentStreak || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-body">consecutive days</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Target className="h-4 w-4 text-purple-500" />
                <span className="text-xs sm:text-sm font-medium font-body text-muted-foreground">Success Rate</span>
              </div>
              <p className="text-2xl sm:text-3xl font-heading text-foreground">
                {submissionStats?.successRate || 0}%
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-xs sm:text-sm font-medium font-body text-muted-foreground">Best Time</span>
              </div>
              <p className="text-2xl sm:text-3xl font-heading text-orange-500">
                {userStats?.bestTime ? `${userStats.bestTime}s` : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-heading">
                <Brain className="h-4 w-4 text-indigo-500" />
                Submission Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">Total Submissions:</span>
                  <span className="font-medium font-heading text-sm">{submissionStats?.totalSubmissions || 0}</span>
                </div>
                <Separator className="opacity-30" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">Correct Submissions:</span>
                  <span className="font-medium font-heading text-sm text-green-500">{submissionStats?.correctSubmissions || 0}</span>
                </div>
                <Separator className="opacity-30" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">Average Time:</span>
                  <span className="font-medium font-heading text-sm">{submissionStats?.averageTime || 0}s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-heading">
                <Sword className="h-4 w-4 text-red-500" />
                Arena Mode Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">Total Matches:</span>
                  <span className="font-medium font-heading text-sm">{arenaStats?.totalMatches || 0}</span>
                </div>
                <Separator className="opacity-30" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">Wins:</span>
                  <span className="font-medium font-heading text-sm text-green-500">{arenaStats?.wins || 0}</span>
                </div>
                <Separator className="opacity-30" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">Win Rate:</span>
                  <span className="font-medium font-heading text-sm">{arenaStats?.winRate || 0}%</span>
                </div>
                <Separator className="opacity-30" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">Forfeits:</span>
                  <span className="font-medium font-heading text-sm text-red-500">{arenaStats?.forfeits || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-heading">
                <Calendar className="h-4 w-4 text-blue-500" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">Username:</span>
                  <span className="font-medium font-heading text-sm">{userStats?.username || 'Not set'}</span>
                </div>
                <Separator className="opacity-30" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">Member Since:</span>
                  <span className="font-medium font-heading text-sm">
                    {userStats?.joinedAt ? new Date(userStats.joinedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <Separator className="opacity-30" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-muted-foreground">User ID:</span>
                  <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px]">{userId}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card className="mb-5 sm:mb-6 card-hover border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-heading">
              <Zap className="h-4 w-4 text-yellow-500" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions && recentSubmissions.length > 0 ? (
              <div className="space-y-2">
                {recentSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 bg-muted/30 rounded-md gap-2 sm:gap-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <Badge className={`text-xs ${submission.isCorrect ? 'bg-green-500/20 text-green-600 border-green-500/30' : 'bg-red-500/20 text-red-600 border-red-500/30'}`}>
                        {submission.isCorrect ? 'PASS' : 'FAIL'}
                      </Badge>
                      <span className="font-medium text-sm font-body">Problem {submission.problemId}</span>
                      <span className="text-xs text-muted-foreground font-body">({submission.language})</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground font-body">
                      <span>{submission.timeTaken}s</span>
                      <span>•</span>
                      <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 sm:py-6 text-muted-foreground">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-muted-foreground/30" />
                <p className="text-sm font-body">No submissions yet. Start solving problems to see your progress!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <Link href="/problem">
            <Button className="flex items-center gap-1.5 text-sm h-9 hover:scale-[1.02] transition-transform">
              <Target className="h-3.5 w-3.5" />
              Practice Problems
            </Button>
          </Link>
          <Link href="/arena">
            <Button className="flex items-center gap-1.5 text-sm h-9 hover:scale-[1.02] transition-transform">
              <Sword className="h-3.5 w-3.5" />
              Arena Mode
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="outline" className="flex items-center gap-1.5 text-sm h-9 hover:scale-[1.02] transition-transform border-border/50">
              <Crown className="h-3.5 w-3.5" />
              Leaderboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-1.5 text-sm h-9 hover:scale-[1.02] transition-transform border-border/50">
              <Trophy className="h-3.5 w-3.5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
