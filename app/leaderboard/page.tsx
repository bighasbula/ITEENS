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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <Crown className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500" />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Arena Leaderboard</h1>
          </div>
          <p className="text-lg sm:text-xl font-bold text-muted-foreground">Top 20 players by wins</p>
        </div>

        {/* Leaderboard */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Top Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div key={player.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm">
                        {index === 0 && (
                          <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                            <Crown className="h-4 w-4" />
                          </div>
                        )}
                        {index === 1 && (
                          <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center">
                            <Medal className="h-4 w-4" />
                          </div>
                        )}
                        {index === 2 && (
                          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                            <Medal className="h-4 w-4" />
                          </div>
                        )}
                        {index > 2 && (
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div>
                        <h3 className="font-semibold text-lg">{player.username}</h3>
                        <p className="text-sm text-[#68169b]">
                          Joined {player.joinedAt ? new Date(player.joinedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                      <div className="text-right text-[#68169b]">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <span className="font-bold text-lg">{player.wins}</span>
                        </div>
                        <p className="text-xs text-[#68169b]">wins</p>
                      </div>
                      
                      <Separator orientation="vertical" className="h-8" />
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-lg">{player.winRate}%</span>
                        </div>
                        <p className="text-xs text-[#68169b]">win rate</p>
                      </div>
                      
                      <Separator orientation="vertical" className="h-8" />
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-bold text-lg">{player.totalMatches}</span>
                        </div>
                        <p className="text-xs text-[#68169b]">matches</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Crown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No players yet. Start playing Arena Mode to see the leaderboard!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              How to Rank Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sword className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Play Arena Mode</h3>
                <p className="text-sm text-muted-foreground">Challenge other players in 1v1 battles</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Win Matches</h3>
                <p className="text-sm text-muted-foreground">Solve problems faster than your opponent</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-1">Climb the Ranks</h3>
                <p className="text-sm text-muted-foreground">More wins = higher ranking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link href="/arena">
            <Button className="flex items-center gap-2">
              <Sword className="h-4 w-4" />
              Play Arena Mode
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
