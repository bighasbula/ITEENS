'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { useUser } from '@/lib/hooks/useUser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { PROBLEMS, TWO_SUM_PROBLEM } from '@/lib/problems'
import { Loader2, Users, Trophy, Clock, Zap, AlertCircle, Crown } from 'lucide-react'
import Link from 'next/link'

export default function ArenaPage() {
  const { userId } = useUser()
  const router = useRouter()
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createMatch = useMutation(api.matches.createMatch)
  const cancelMatch = useMutation(api.matches.cancelMatch)

  // Check if user already has an active match
  const activeMatch = useQuery(
    api.matches.getUserActiveMatch,
    userId ? { userId } : "skip"
  )



  // Subscribe to match updates
  const matchUpdates = useQuery(
    api.matches.subscribeToMatch,
    currentMatchId ? { matchId: currentMatchId as Id<"matches"> } : "skip"
  )

  // Get user's match history
  const userMatches = useQuery(
    api.matches.getUserMatches,
    userId ? { userId } : "skip"
  )

  // Check for existing active match on component mount
  useEffect(() => {
    if (activeMatch && !isSearching) {
      setIsSearching(true)
      setCurrentMatchId(activeMatch._id)
      setSelectedProblem(activeMatch.problemId)
    }
  }, [activeMatch, isSearching])

  const handlePlay1v1 = async (problemId: string) => {
    if (!userId) return

    // Clear any previous errors
    setError(null)

    // Check if user already has an active match
    if (activeMatch) {
      setError("You are already in an active match queue. Please cancel your current search first.")
      return
    }

    setIsSearching(true)
    setSelectedProblem(problemId)

    try {
      // Try to create or join a match
      const matchId = await createMatch({
        userId,
        problemId,
      })

      setCurrentMatchId(matchId)
      
      // If we created a match, we're waiting for an opponent
      // If we joined a match, we go directly to the game
      // We'll handle the redirect in the useEffect when matchUpdates changes
    } catch (error: unknown) {
      console.error('Error creating/joining match:', error)
      setError((error as Error).message || 'Failed to create/join match')
      setIsSearching(false)
      setSelectedProblem(null)
    }
  }

  const handleCancelSearch = async () => {
    if (!userId) return

    try {
      await cancelMatch({ userId })
      setIsSearching(false)
      setSelectedProblem(null)
      setCurrentMatchId(null)
      setError(null)
    } catch (error: unknown) {
      console.error('Error canceling match:', error)
      setError('Failed to cancel search')
    }
  }

  // Listen for match updates
  useEffect(() => {
    if (matchUpdates && matchUpdates.status === "in-progress" && currentMatchId) {
      setIsSearching(false)
      setSelectedProblem(null)
      setError(null)
      router.push(`/arena/match/${currentMatchId}`)
    }
  }, [matchUpdates, currentMatchId, router])

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access the Arena Mode.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-foreground mb-2 sm:mb-3">
            ⚔️ Arena Mode
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-body">
            Challenge other developers in real-time 1v1 coding battles
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-destructive" />
            <span className="text-destructive text-xs sm:text-sm font-body">{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
              className="ml-auto text-destructive hover:text-destructive/80 h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        )}

        {/* Searching Overlay */}
        {isSearching && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-full max-w-md card-hover border-border/50 bg-card/90 backdrop-blur-md">
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <CardTitle className="text-base font-heading">Finding Opponent...</CardTitle>
                <CardDescription className="text-xs sm:text-sm font-body">
                  Looking for someone to challenge on &quot;{PROBLEMS.find(p => p.id === selectedProblem)?.name}&quot;
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  onClick={handleCancelSearch}
                  className="text-xs sm:text-sm h-8 hover:scale-[1.02] transition-transform"
                >
                  Cancel Search
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Available Problems */}
          <div className="lg:col-span-2">
            <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-heading">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Available Challenges
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm font-body">
                  Select any problem to start a 1v1 battle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[...PROBLEMS, TWO_SUM_PROBLEM].map((problem) => (
                    <Card key={problem.id} className="card-hover border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-xs sm:text-sm font-heading">{problem.name}</h3>
                          <Badge 
                            variant={
                              problem.difficulty === 'Easy' ? 'default' :
                              problem.difficulty === 'Medium' ? 'secondary' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 font-body">
                          {problem.description}
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full text-xs h-8 hover:scale-[1.02] transition-transform"
                          onClick={() => handlePlay1v1(problem.id)}
                          disabled={isSearching || !!activeMatch}
                        >
                          {activeMatch ? 'Already Searching' : 'Play 1v1'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Match History & Stats */}
          <div className="space-y-4 sm:space-y-5">
            {/* Quick Stats */}
            <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-heading">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground font-body">Total Matches</span>
                    <span className="font-medium font-heading text-sm">{userMatches?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground font-body">Wins</span>
                    <span className="font-medium font-heading text-sm text-green-500">
                      {userMatches?.filter(m => m.winnerId === userId).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground font-body">Forfeits</span>
                    <span className="font-medium font-heading text-sm text-red-500">
                      {userMatches?.filter(m => m.status === 'forfeited' && m.winnerId !== userId).length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground font-body">Win Rate</span>
                    <span className="font-medium font-heading text-sm">
                      {userMatches && userMatches.length > 0 
                        ? Math.round((userMatches.filter(m => m.winnerId === userId).length / userMatches.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Matches */}
            <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-heading">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Recent Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userMatches && userMatches.length > 0 ? (
                  <div className="space-y-2">
                    {userMatches.slice(0, 5).map((match) => (
                      <div key={match._id} className="flex items-center justify-between p-2.5 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium font-body truncate">
                            {PROBLEMS.find(p => p.id === match.problemId)?.name || match.problemId}
                          </p>
                          <p className="text-xs text-muted-foreground font-body">
                            {new Date(match.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            match.winnerId === userId ? 'default' :
                            match.status === 'completed' ? 'secondary' :
                            match.status === 'forfeited' ? 'destructive' : 'outline'
                          }
                          className="text-xs ml-2 flex-shrink-0"
                        >
                          {match.winnerId === userId ? 'Won' :
                           match.status === 'completed' ? 'Lost' :
                           match.status === 'forfeited' ? 'Forfeit' : match.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-muted-foreground text-center py-4 font-body">
                    No matches yet. Start your first battle!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* How to Play */}
            <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-heading">
                  <Users className="h-4 w-4 text-purple-500" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5 text-xs sm:text-sm font-body">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Select a problem to start matchmaking</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">Wait for an opponent to join</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">First correct submission wins!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Link */}
            <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-heading">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 font-body">
                  See how you rank against other players!
                </p>
                <Link href="/leaderboard">
                  <Button size="sm" className="w-full text-xs h-8 hover:scale-[1.02] transition-transform">
                    View Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  )
}
