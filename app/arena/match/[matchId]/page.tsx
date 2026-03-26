'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useUser } from '@/lib/hooks/useUser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PROBLEMS, getProblemById } from '@/lib/problems'
import CodeEditor from '@/components/CodeEditor'
import { Loader2, Trophy, Clock, AlertTriangle } from 'lucide-react'
import { SupportedLanguage } from '@/lib/judge0'
import { LANGUAGE_IDS } from '@/lib/judge0'

interface Player {
  id: string
  name: string
  hasSubmitted: boolean
  submissionTime?: number
}

export default function MatchPage() {
  const params = useParams()
  const router = useRouter()
  const { userId } = useUser()
  const matchId = params.matchId as string

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python')
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isPageVisible, setIsPageVisible] = useState(true)

  // Get match data with real-time subscription
  const match = useQuery(api.matches.subscribeToMatch, { matchId: matchId as any })
  
  // Get user data for both players
  const player1 = useQuery(api.users.getUserById, 
    match?.userId1 ? { userId: match.userId1 } : "skip"
  )
  const player2 = useQuery(api.users.getUserById, 
    match?.userId2 ? { userId: match.userId2 } : "skip"
  )

  // Mutations
  const markMatchWon = useMutation(api.matches.markMatchWon)
  const forfeitMatch = useMutation(api.matches.forfeitMatch)
  const cancelMatch = useMutation(api.matches.cancelMatch)

  // Get problem data
  const problem = match?.problemId ? getProblemById(match.problemId) : null

  // Determine current player info
  const isPlayer1 = match?.userId1 === userId
  const isPlayer2 = match?.userId2 === userId
  const isInMatch = isPlayer1 || isPlayer2
  const opponent = isPlayer1 ? player2 : player1

  // Anti-cheat: Page Visibility API
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && match?.status === 'in-progress' && isInMatch) {
      setIsPageVisible(false)
      // Forfeit the match if user switches tabs or minimizes
      forfeitMatch({ 
        matchId: matchId as any, 
        userId: userId!,
        reason: "switched_tab"
      })
    } else {
      setIsPageVisible(true)
    }
  }, [match?.status, isInMatch, forfeitMatch, matchId, userId])

  // Anti-cheat: Before unload
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (match?.status === 'in-progress' && isInMatch) {
      // Forfeit the match if user leaves the page
      forfeitMatch({ 
        matchId: matchId as any, 
        userId: userId!,
        reason: "left_page"
      })
      event.preventDefault()
      event.returnValue = ''
    }
  }, [match?.status, isInMatch, forfeitMatch, matchId, userId])

  // Set up anti-cheat listeners
  useEffect(() => {
    if (match?.status === 'in-progress' && isInMatch) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('beforeunload', handleBeforeUnload)
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [match?.status, isInMatch, handleVisibilityChange, handleBeforeUnload])

  // Timer effect
  useEffect(() => {
    const computeElapsedSeconds = (startAt?: number, endAt?: number) => {
      if (!startAt || !endAt) return 0
      const elapsedMs = endAt - startAt
      // Prevent negative timer values caused by client/server clock skew.
      return Math.max(0, Math.floor(elapsedMs / 1000))
    }

    // While the match is running, tick using current time.
    if (match?.status === 'in-progress' && match.startedAt) {
      const interval = setInterval(() => {
        setTimeElapsed(computeElapsedSeconds(match.startedAt, Date.now()))
      }, 1000)
      return () => clearInterval(interval)
    }

    // After the match ends, lock the timer to completedAt (if available).
    if (
      match?.status !== 'waiting' &&
      match?.status !== 'in-progress' &&
      match.startedAt &&
      match.completedAt
    ) {
      setTimeElapsed(computeElapsedSeconds(match.startedAt, match.completedAt))
    }
  }, [match?.status, match?.startedAt, match?.completedAt])

  // Initialize code when problem loads or language changes
  useEffect(() => {
    if (problem) {
      setCode(problem.defaultCode[selectedLanguage])
    }
  }, [problem, selectedLanguage])

  // Handle code submission
  const handleSubmit = async () => {
    if (!problem || !userId || isSubmitting) return

    setIsSubmitting(true)
    try {
      // Submit code to Judge0
      const response = await fetch('/api/judge0/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: selectedLanguage,
          stdin: problem.testCases[0].input,
        }),
      })

      const result = await response.json()
      setSubmissionResult(result)

      // Check if solution is correct
      if (result.status?.id === 3 && result.stdout?.trim() === problem.testCases[0].expectedOutput.trim()) {
        // Mark as winner
        await markMatchWon({ matchId: matchId as any, winnerId: userId })
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLeaveMatch = async () => {
    if (match?.status === 'waiting' && isInMatch) {
      // Cancel the match if still waiting
      try {
        await cancelMatch({ userId: userId! })
        router.push('/arena')
      } catch (error) {
        console.error('Error canceling match:', error)
      }
    } else {
      router.push('/arena')
    }
  }

  if (!match || !isInMatch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Match Not Found</CardTitle>
            <CardDescription>
              This match doesn't exist or you're not a participant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/arena')}>
              Back to Arena
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24">
      {/* Anti-cheat Warning */}
      {!isPageVisible && (
        <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground p-2 text-center z-50">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="text-xs sm:text-sm font-medium font-body">
              WARNING: You switched tabs! This may result in a forfeit.
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 max-w-7xl">
        {/* Match Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-heading text-foreground">
              {problem?.name} - 1v1 Battle
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-body mt-1">
              {isPlayer1 ? 'You vs ' + (player2?.username || 'Opponent') : (player1?.username || 'Opponent') + ' vs You'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-sm sm:text-base font-heading">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
            </div>
            
            <Badge variant={match.status === 'in-progress' ? 'default' : 'secondary'} className="text-xs font-body">
              {match.status === 'in-progress' ? 'In Progress' : match.status}
            </Badge>
          </div>
        </div>

        {/* Match Status Overlay */}
        {match.status === 'waiting' && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-full max-w-md card-hover border-border/50 bg-card/90 backdrop-blur-md">
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <CardTitle className="text-base font-heading">Waiting for Opponent</CardTitle>
                <CardDescription className="text-xs sm:text-sm font-body">
                  Share this link with a friend to start the battle!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  onClick={handleLeaveMatch}
                  className="text-xs sm:text-sm h-8 hover:scale-[1.02] transition-transform border-border/50 font-body"
                >
                  Cancel Match
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Winner Announcement */}
        {(match.status === 'completed' || match.status === 'forfeited') && match.winnerId && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-full max-w-md card-hover border-border/50 bg-card/90 backdrop-blur-md">
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-3">
                  {match.status === 'completed' ? (
                    <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500" />
                  ) : (
                    <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-base sm:text-lg font-heading">
                  {match.winnerId === userId ? 'You Won! 🎉' : 'You Lost 😔'}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm font-body">
                  {match.status === 'completed' ? (
                    match.winnerId === userId 
                      ? 'Congratulations! You solved it first!'
                      : 'Better luck next time!'
                  ) : (
                    match.winnerId === userId 
                      ? `Your opponent ${match.forfeitReason === 'left_page' ? 'left the match' : 'switched tabs'}`
                      : `You ${match.forfeitReason === 'left_page' ? 'left the match' : 'switched tabs'}`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-xs sm:text-sm text-muted-foreground font-body">
                  Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                </div>
                <Button onClick={() => router.push('/arena')} className="text-xs sm:text-sm h-8 hover:scale-[1.02] transition-transform font-body">
                  Back to Arena
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {match.status === 'in-progress' && problem && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {/* Problem Description */}
            <div className="space-y-3 sm:space-y-4">
              <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base font-heading">{problem.name}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm font-body">
                    {problem.difficulty} • {problem.tags.join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="font-medium text-xs sm:text-sm mb-1.5 font-heading">Description</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground font-body">
                        {problem.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-xs sm:text-sm mb-1.5 font-heading">Sample Input</h3>
                      <pre className="bg-muted/30 p-2 rounded-md text-xs sm:text-sm font-mono">
                        {problem.sampleInput}
                      </pre>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-xs sm:text-sm mb-1.5 font-heading">Sample Output</h3>
                      <pre className="bg-muted/30 p-2 rounded-md text-xs sm:text-sm font-mono">
                        {problem.sampleOutput}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Code Editor */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-heading">Your Code</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      const newLanguage = e.target.value as SupportedLanguage;
                      setSelectedLanguage(newLanguage);
                      // Update code immediately when language changes
                      if (problem) {
                        setCode(problem.defaultCode[newLanguage]);
                      }
                    }}
                    className="px-2.5 py-1 border border-border/50 rounded-md text-xs sm:text-sm bg-background/50 font-body"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="h-8 text-xs sm:text-sm hover:scale-[1.02] transition-transform font-body"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="border border-border/50 rounded-md overflow-hidden" style={{ height: '400px' }}>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={selectedLanguage}
                  defaultCode={problem.defaultCode[selectedLanguage]}
                />
              </div>

              {/* Submission Result */}
              {submissionResult && (
                <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-heading">
                      {submissionResult.status?.id === 3 && submissionResult.stdout?.trim() === problem.testCases[0].expectedOutput.trim() ? (
                        <>
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                          Test Passed! ✅
                        </>
                      ) : (
                        <>
                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          Test Failed ❌
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      <div>
                        <span className="font-medium text-xs sm:text-sm font-heading">Expected Output:</span>
                        <pre className="bg-muted/30 p-2 rounded-md text-xs sm:text-sm mt-1 font-mono">
                          {problem.testCases[0].expectedOutput}
                        </pre>
                      </div>
                      <div>
                        <span className="font-medium text-xs sm:text-sm font-heading">Your Output:</span>
                        <pre className="bg-muted/30 p-2 rounded-md text-xs sm:text-sm mt-1 font-mono">
                          {submissionResult.stdout || 'No output'}
                        </pre>
                      </div>
                      {submissionResult.stderr && (
                        <div>
                          <span className="font-medium text-xs sm:text-sm text-red-600 font-heading">Error:</span>
                          <pre className="bg-red-50 p-2 rounded-md text-xs sm:text-sm mt-1 text-red-700 font-mono">
                            {submissionResult.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
             </div>
           </div>
         )}
      </div>
    </div>
  )
}
