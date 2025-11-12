'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Trophy, 
  Medal,
  TrendingUp,
  Users,
  ArrowLeft,
  Info,
  Sword,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const leaderboard = useQuery(api.matches.getLeaderboard);

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <Crown className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-500" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading text-foreground">Arena Leaderboard</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground font-body">Top 20 players by wins</p>
        </div>

        {/* Leaderboard */}
        <Card className="mb-5 sm:mb-6 card-hover border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-heading">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Top Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((player, index) => (
                  <div key={player.userId} className="flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors border border-border/30">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Rank Badge */}
                      <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold text-xs sm:text-sm flex-shrink-0">
                        {index === 0 && (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                            <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </div>
                        )}
                        {index === 1 && (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-400 text-white rounded-full flex items-center justify-center">
                            <Medal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </div>
                        )}
                        {index === 2 && (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-orange-500 text-white rounded-full flex items-center justify-center">
                            <Medal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </div>
                        )}
                        {index > 2 && (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary/20 text-primary rounded-full flex items-center justify-center font-heading">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground font-heading truncate">{player.username}</h3>
                        <p className="text-xs text-muted-foreground font-body">
                          Joined {player.joinedAt ? new Date(player.joinedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500" />
                          <span className="font-bold text-sm sm:text-base font-heading">{player.wins}</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-body">wins</p>
                      </div>
                      
                      <Separator orientation="vertical" className="h-6 sm:h-8 opacity-30" />
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                          <span className="font-bold text-sm sm:text-base font-heading">{player.winRate}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-body">win rate</p>
                      </div>
                      
                      <Separator orientation="vertical" className="h-6 sm:h-8 opacity-30" />
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500" />
                          <span className="font-bold text-sm sm:text-base font-heading">{player.totalMatches}</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-body">matches</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10">
                <Crown className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm sm:text-base text-muted-foreground font-body">No players yet. Start playing Arena Mode to see the leaderboard!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mb-5 sm:mb-6 card-hover border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-heading">
              <Info className="h-4 w-4 text-blue-500" />
              How to Rank Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sword className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                </div>
                <h3 className="font-medium text-sm sm:text-base mb-1 font-heading">Play Arena Mode</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-body">Challenge other players in 1v1 battles</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
                <h3 className="font-medium text-sm sm:text-base mb-1 font-heading">Win Matches</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-body">Solve problems faster than your opponent</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                </div>
                <h3 className="font-medium text-sm sm:text-base mb-1 font-heading">Climb the Ranks</h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-body">More wins = higher ranking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <Link href="/arena">
            <Button className="flex items-center gap-1.5 text-sm h-9 hover:scale-[1.02] transition-transform">
              <Sword className="h-3.5 w-3.5" />
              Play Arena Mode
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center gap-1.5 text-sm h-9 hover:scale-[1.02] transition-transform border-border/50">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
