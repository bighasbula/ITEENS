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
    if (match?.status === 'in-progress' && match.startedAt) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - match.startedAt!) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [match?.status, match?.startedAt])

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
    <div className="min-h-screen bg-background">
      {/* Anti-cheat Warning */}
      {!isPageVisible && (
        <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground p-2 text-center z-50">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              WARNING: You switched tabs! This may result in a forfeit.
            </span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Match Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {problem?.name} - 1v1 Battle
            </h1>
            <p className="text-muted-foreground">
              {isPlayer1 ? 'You vs ' + (player2?.username || 'Opponent') : (player1?.username || 'Opponent') + ' vs You'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
            </div>
            
            <Badge variant={match.status === 'in-progress' ? 'default' : 'secondary'}>
              {match.status === 'in-progress' ? 'In Progress' : match.status}
            </Badge>
          </div>
        </div>

        {/* Match Status Overlay */}
        {match.status === 'waiting' && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <CardTitle>Waiting for Opponent</CardTitle>
                <CardDescription>
                  Share this link with a friend to start the battle!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  onClick={handleLeaveMatch}
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
             <Card className="w-full max-w-md">
               <CardHeader className="text-center">
                 <div className="flex justify-center mb-4">
                   {match.status === 'completed' ? (
                     <Trophy className="h-12 w-12 text-yellow-500" />
                   ) : (
                     <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                       <AlertTriangle className="h-6 w-6 text-red-600" />
                     </div>
                   )}
                 </div>
                 <CardTitle>
                   {match.winnerId === userId ? 'You Won! 🎉' : 'You Lost 😔'}
                 </CardTitle>
                 <CardDescription>
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
               <CardContent className="text-center space-y-4">
                 <div className="text-sm text-muted-foreground">
                   Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                 </div>
                 <Button onClick={() => router.push('/arena')}>
                   Back to Arena
                 </Button>
               </CardContent>
             </Card>
           </div>
         )}

                 {/* Main Content */}
         {match.status === 'in-progress' && problem && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Problem Description */}
             <div className="space-y-4">
               <Card>
                 <CardHeader>
                   <CardTitle>{problem.name}</CardTitle>
                   <CardDescription>
                     {problem.difficulty} • {problem.tags.join(', ')}
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     <div>
                       <h3 className="font-semibold mb-2">Description</h3>
                       <p className="text-sm text-muted-foreground">
                         {problem.description}
                       </p>
                     </div>
                     
                     <div>
                       <h3 className="font-semibold mb-2">Sample Input</h3>
                       <pre className="bg-muted p-2 rounded text-sm">
                         {problem.sampleInput}
                       </pre>
                     </div>
                     
                     <div>
                       <h3 className="font-semibold mb-2">Sample Output</h3>
                       <pre className="bg-muted p-2 rounded text-sm">
                         {problem.sampleOutput}
                       </pre>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </div>

             {/* Code Editor */}
             <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <h2 className="text-lg font-semibold">Your Code</h2>
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
                     className="px-3 py-1 border rounded text-sm"
                   >
                     <option value="python">Python</option>
                     <option value="javascript">JavaScript</option>
                     <option value="java">Java</option>
                     <option value="cpp">C++</option>
                   </select>
                   <Button 
                     onClick={handleSubmit} 
                     disabled={isSubmitting}
                     className="ml-2"
                   >
                     {isSubmitting ? (
                       <>
                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                         Submitting...
                       </>
                     ) : (
                       'Submit'
                     )}
                   </Button>
                 </div>
               </div>
               
               <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
                 <CodeEditor
                   value={code}
                   onChange={setCode}
                   language={selectedLanguage}
                   defaultCode={problem.defaultCode[selectedLanguage]}
                 />
               </div>

                               {/* Submission Result */}
                {submissionResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {submissionResult.status?.id === 3 && submissionResult.stdout?.trim() === problem.testCases[0].expectedOutput.trim() ? (
                          <>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            Test Passed! ✅
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            Test Failed ❌
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="font-semibold">Expected Output:</span>
                          <pre className="bg-muted p-2 rounded text-sm mt-1">
                            {problem.testCases[0].expectedOutput}
                          </pre>
                        </div>
                        <div>
                          <span className="font-semibold">Your Output:</span>
                          <pre className="bg-muted p-2 rounded text-sm mt-1">
                            {submissionResult.stdout || 'No output'}
                          </pre>
                        </div>
                        {submissionResult.stderr && (
                          <div>
                            <span className="font-semibold text-red-600">Error:</span>
                            <pre className="bg-red-50 p-2 rounded text-sm mt-1 text-red-700">
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
