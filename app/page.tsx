'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useUser } from '@/lib/hooks/useUser'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">Welcome to ITEENS</h1>
          <p className="text-lg sm:text-xl font-semibold text-muted-foreground">Your competitive coding platform</p>
        </div>

        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <div className="text-center py-12 sm:py-20">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
              Sign in to get started
            </h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              A competitive coding platform where you can practice, improve, and battle with other developers.
            </p>
            <SignInButton>
              <Button size="lg">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </Unauthenticated>
      </div>
    </div>
  )
}

function Content() {
  const { userId } = useUser();
  const recentSubmissions = useQuery(
    api.submissions.getUserSubmissions, 
    userId ? { userId } : "skip"
  );
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header - Centered */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
          Ready to Code?
        </h2>
        <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
          Choose your challenge and start coding!
        </p>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Left Column - Full width on mobile, 2/3 on desktop */}
        <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6">
          {/* Top Row - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border border-border card-hover">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-card-foreground">Practice Mode</h3>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Solve coding problems at your own pace. Get instant feedback and AI-powered code analysis.
              </p>
              <Link href="/problems">
                <Button className="w-full" variant="outline" size="sm">
                  Browse Problems
                </Button>
              </Link>
            </div>

            <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border border-border card-hover">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-card-foreground">Your Dashboard</h3>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Track your progress, view statistics, and see your coding achievements.
              </p>
              <Link href="/dashboard">
                <Button className="w-full" variant="outline" size="sm">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Bottom Row - Arena Mode card (full width) */}
          <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border border-border opacity-50">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-card-foreground">Arena Mode</h3>
            <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              Real-time 1v1 coding battles. Coming soon!
            </p>
            <Button className="w-full" disabled size="sm">
              Coming Soon
            </Button>
          </div>
        </div>

        {/* Right Column - Full width on mobile, 1/3 on desktop */}
        <div className="w-full lg:w-1/3">
          <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border border-border h-full">
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-card-foreground">Recent Activity</h3>
            <div className="text-muted-foreground">
              {recentSubmissions && recentSubmissions.length > 0 ? (
                <div>
                  <p className="mb-2 text-sm sm:text-base">You have {recentSubmissions.length} recent submissions</p>
                  <div className="text-xs sm:text-sm space-y-1">
                    {recentSubmissions.slice(0, 3).map((submission, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          submission.isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span>
                          {submission.isCorrect ? '✅' : '❌'} Problem {submission.problemId} 
                          ({submission.timeTaken}s)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base">No recent activity. Start coding to see your progress!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
