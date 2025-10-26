'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useUser } from '@/lib/hooks/useUser'
import { Users, Target, TrendingUp, Trophy, Sword, Code, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const heroImages = [
    '/images/people/IMG_9818.JPG', 
    '/images/people/IMG_9833.JPG',
    '/images/people/IMG_9927.JPG'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000) // 5 seconds delay

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Hero background ${index + 1}`}
                fill
                className="object-cover w-full h-full"
                priority={index === 0}
              />
              {/* Purple gradient overlay for better navigation visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-purple-800/60 to-black/70" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Heading */}
            <div className="mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-6xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                <br />
                  The coolest coding platform
                </span>
              </h1>
              
              <div className="space-y-4 sm:space-y-6">
                <p className="text-lg sm:text-2xl lg:text-3xl font-semibold text-white/90 leading-relaxed">
                  Battle other developers,
                  practice problems, <br />
                  and climb the leaderboard.
                </p>
                
                <p className="text-base sm:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Ready to Code? Choose your challenge and start rocking!
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12">
              <SignInButton>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-purple-50 w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  Enter Arena
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>

        {/* Gradient Separator */}
        <div className="absolute bottom-0 left-0 right-0 h-42 bg-gradient-to-b from-transparent via-purple-900/20 to-[#18181B] z-20"></div>
      </section>

      {/* Feature Section 1: Online 1v1 Coding Battles */}
      <br />
      <br />
      <br />
      <br />
      <section className="py-12 sm:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 sm:mb-6">
                <Sword className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground relative">
                  <span className="relative z-10">Online 1v1 Coding Battles</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4f2a70]/20 to-transparent blur-xl transform -skew-x-12 scale-210"></div>
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#4f2a70]/40 to-transparent blur-lg transform skew-x-6 scale-405"></div>
                </h2>
                
              </div>
              <p className="text-base sm:text-lg text-foreground mb-6 sm:mb-8 leading-relaxed">
                Challenge developers from around the world in intense 1v1 coding battles. 
                Test your skills, learn new techniques, and prove you're the best coder 
                in real-time competitions.
              </p>
              <SignInButton>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  Join Live Battle
                </Button>
              </SignInButton>
            </div>
            
            {/* Image Frame */}
            <div className="flex-1 order-1 lg:order-2 w-full">
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg shadow-2xl overflow-hidden aspect-video p-2 sm:p-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden w-full h-full">
                  <img 
                    src="/images/landing-page/1v1-battles.JPG" 
                    alt="1v1 Coding Battle Demo"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center hidden">
                    <div className="text-center text-gray-400 p-4">
                      <Code className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                      <p className="text-base sm:text-lg font-medium">Coding Battle Demo</p>
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
      <section className="py-12 sm:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 sm:gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 sm:mb-6">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground relative">
                  <span className="relative z-10">Practice Your Skills</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4f2a70]/20 to-transparent blur-xl transform -skew-x-12 scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#4f2a70]/54 to-transparent blur-lg transform skew-x-6 scale-505"></div>
                </h2>
                
              </div>
              <p className="text-base sm:text-lg text-foreground mb-6 sm:mb-8 leading-relaxed">
                Sharpen your coding abilities with our extensive database of problems. 
                From beginner-friendly challenges to advanced algorithms, practice at 
                your own pace and build your expertise.
              </p>
              <Link href="/problems">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  Browse Problems
                </Button>
              </Link>
            </div>
            
            {/* Image Frame */}
            <div className="flex-1 order-1 lg:order-2 w-full">
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg shadow-2xl overflow-hidden aspect-video p-2 sm:p-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden w-full h-full">
                  <img 
                    src="/images/landing-page/practice-skills.gif" 
                    alt="Problem Database Demo"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center hidden">
                    <div className="text-center text-gray-400 p-4">
                      <BarChart3 className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                      <p className="text-base sm:text-lg font-medium">Problem Database</p>
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
      <section className="py-12 sm:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 sm:mb-6">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground relative">
                  <span className="relative z-10">Track Your Progress</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4f2a70]/20 to-transparent blur-xl transform -skew-x-12 scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#4f2a70]/54 to-transparent blur-lg transform skew-x-6 scale-505"></div>
                </h2>

              </div>
              <p className="text-base sm:text-lg text-foreground mb-6 sm:mb-8 leading-relaxed">
                Monitor your coding journey with detailed analytics. View your statistics, 
                track improvement over time, and see your coding achievements with 
                comprehensive progress tracking.
              </p>
              <SignInButton>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  View Dashboard
                </Button>
              </SignInButton>
            </div>
            
            {/* Image Frame */}
            <div className="flex-1 order-1 lg:order-2 w-full">
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg shadow-2xl overflow-hidden aspect-video p-2 sm:p-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden w-full h-full">
                  <img 
                    src="/images/landing-page/track-progress.JPG" 
                    alt="Progress Dashboard Demo"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center hidden">
                    <div className="text-center text-gray-400 p-4">
                      <BarChart3 className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                      <p className="text-base sm:text-lg font-medium">Progress Dashboard</p>
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
      <section className="py-12 sm:py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-8 sm:gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 sm:mb-6">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground relative">
                  <span className="relative z-10">Compete on the Leaderboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4f2a70]/20 to-transparent blur-xl transform -skew-x-12 scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#4f2a70]/54 to-transparent blur-lg transform skew-x-6 scale-505"></div>
                </h2>

              </div>
              <p className="text-base sm:text-lg text-foreground mb-6 sm:mb-8 leading-relaxed">
                Climb the ranks and establish yourself among the top battlers. Compete 
                for the highest position on our global leaderboard and earn recognition 
                for your coding prowess.
              </p>
              <Link href="/leaderboard">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  View Leaderboard
                </Button>
              </Link>
            </div>
            
            {/* Image Frame */}
            <div className="flex-1 order-1 lg:order-2 w-full">
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg shadow-2xl overflow-hidden aspect-video p-2 sm:p-4">
                <div className="bg-gray-900 rounded-lg overflow-hidden w-full h-full">
                  <img 
                    src="/images/landing-page/leaderboard.gif" 
                    alt="Global Leaderboard Demo"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center hidden">
                    <div className="text-center text-gray-400 p-4">
                      <Trophy className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                      <p className="text-base sm:text-lg font-medium">Global Leaderboard</p>
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
      <section className="py-16 sm:py-24 bg-gradient-to-br text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your Coding Journey?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join thousands of developers who are already competing, learning, and growing on ITEENS.
          </p>
          <SignInButton>
            <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 hover:opacity-85 transition-opacity">
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
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 mt-28">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">Welcome to ITEENS</h1>
        <p className="text-lg sm:text-xl font-semibold text-muted-foreground">Your competitive coding platform</p>
      </div>

      <div className="space-y-4 sm:space-y-6 mt-28">
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