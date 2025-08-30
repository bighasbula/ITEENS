'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useUser } from '@/lib/hooks/useUser'
import { Users, Target, TrendingUp, Trophy, Sword, Code, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-background">
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
    </div>
  )
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 pt-14 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Welcome to ITEENS
            </h1>
            <p className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-card-foreground">
              Your competitive coding platform. Battle other developers, practice problems, and climb the leaderboard.
            </p>
            <p className="text-lg sm:text-xl  mb-2 sm:mb-3 text-card-foreground">
              Ready to Code? Choose your challenge and start coding!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignInButton>
                <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50">
                  <Link href="/arena">
                    Enter Arena
                  </Link>
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1: Online 1v1 Coding Battles */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <Sword className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Online 1v1 Coding Battles
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Challenge developers from around the world in intense 1v1 coding battles. 
                Test your skills, learn new techniques, and prove you're the best coder 
                in real-time competitions.
              </p>
              <SignInButton>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Join Live Battle
                </Button>
              </SignInButton>
            </div>
            
            {/* Image Frame */}
            <div className="flex-1">
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg shadow-2xl overflow-hidden aspect-video p-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <img 
                    src="/images/landing-page/1v1-battles.jpg" 
                    alt="1v1 Coding Battle Demo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center hidden">
                    <div className="text-center text-gray-400">
                      <Code className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Coding Battle Demo</p>
                      <p className="text-sm">(Image will be placed here)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Feature Section 2: Practice Your Skills */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <Target className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Practice Your Skills
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Sharpen your coding abilities with our extensive database of problems. 
                From beginner-friendly challenges to advanced algorithms, practice at 
                your own pace and build your expertise.
              </p>
              <Link href="/problems">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Browse Problems
                </Button>
              </Link>
            </div>
            
            {/* Image Frame */}
            <div className="flex-1">
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg shadow-2xl overflow-hidden aspect-video p-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <img 
                    src="/images/landing-page/practice-skills.gif" 
                    alt="Problem Database Demo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center hidden">
                    <div className="text-center text-gray-400">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Problem Database</p>
                      <p className="text-sm">(GIF will be placed here)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 3: Track Your Progress */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Track Your Progress
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Monitor your coding journey with detailed analytics. View your statistics, 
                track improvement over time, and see your coding achievements with 
                comprehensive progress tracking.
              </p>
              <SignInButton>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  View Dashboard
                </Button>
              </SignInButton>
            </div>
            
            {/* Image Frame */}
            <div className="flex-1">
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg shadow-2xl overflow-hidden aspect-video p-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <img 
                    src="/images/landing-page/track-progress.jpg" 
                    alt="Progress Dashboard Demo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center hidden">
                    <div className="text-center text-gray-400">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Progress Dashboard</p>
                      <p className="text-sm">(Image will be placed here)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 4: Compete on the Leaderboard */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <Trophy className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Compete on the Leaderboard
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Climb the ranks and establish yourself among the top battlers. Compete 
                for the highest position on our global leaderboard and earn recognition 
                for your coding prowess.
              </p>
              <Link href="/leaderboard">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  View Leaderboard
                </Button>
              </Link>
            </div>
            
            {/* Image Frame */}
            <div className="flex-1">
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg shadow-2xl overflow-hidden aspect-video p-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <img 
                    src="/images/landing-page/leaderboard.gif" 
                    alt="Global Leaderboard Demo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center hidden">
                    <div className="text-center text-gray-400">
                      <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Global Leaderboard</p>
                      <p className="text-sm">(GIF will be placed here)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join thousands of developers who are already competing, learning, and growing on ITEENS.
          </p>
          <SignInButton>
            <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50">
              Get Started Now
            </Button>
          </SignInButton>
        </div>
      </section>
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
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">Welcome to ITEENS</h1>
        <p className="text-lg sm:text-xl font-semibold text-muted-foreground">Your competitive coding platform</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Header - Centered */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
            Ready to Code?
          </h2>
          <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Choose your challenge and start coding!
          </p>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Column - Full width on mobile, 2/3 on desktop */}
          <div className="w-full lg:w-2/3 space-y-3 sm:space-y-4">
            {/* Top Row - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border border-border card-hover">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-card-foreground">⚔️ Arena Mode</h3>
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                Real-time 1v1 coding battles. Challenge other developers and see who solves it first!
              </p>
              <Link href="/arena">
                <Button className="w-full" size="sm">
                  Enter Arena
                </Button>
              </Link>
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
    </div>
  )
}
