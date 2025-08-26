import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new match room if no waiting match exists for the problem
export const createMatch = mutation({
  args: {
    userId: v.string(),
    problemId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, problemId } = args;

    // Check if the user is already in any active match (as player1 or player2)
    const activeMatchAsPlayer1 = await ctx.db
      .query("matches")
      .withIndex("by_userId1_status", (q) => 
        q.eq("userId1", userId).eq("status", "waiting")
      )
      .first();

    const activeMatchAsPlayer2 = await ctx.db
      .query("matches")
      .withIndex("by_userId2_status", (q) => 
        q.eq("userId2", userId).eq("status", "waiting")
      )
      .first();

    if (activeMatchAsPlayer1 || activeMatchAsPlayer2) {
      throw new Error("You are already in an active match queue");
    }

    // First, check if there's already a waiting match for this problem
    const existingMatch = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .filter((q) => q.eq(q.field("problemId"), problemId))
      .first();

    if (existingMatch) {
      // Join the existing match instead of creating a new one
      await ctx.db.patch(existingMatch._id, {
        userId2: userId,
        status: "in-progress",
        startedAt: Date.now(),
      });
      return existingMatch._id;
    }

    // Create a new match room
    const matchId = await ctx.db.insert("matches", {
      userId1: userId,
      userId2: undefined,
      problemId,
      status: "waiting",
      createdAt: Date.now(),
      winnerId: undefined,
      startedAt: undefined,
      completedAt: undefined,
    });

    return matchId;
  },
});

// Join the first available waiting match for a problem
export const joinMatch = mutation({
  args: {
    userId: v.string(),
    problemId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, problemId } = args;

    // Check if the user is already in any active match (as player1 or player2)
    const activeMatchAsPlayer1 = await ctx.db
      .query("matches")
      .withIndex("by_userId1_status", (q) => 
        q.eq("userId1", userId).eq("status", "waiting")
      )
      .first();

    const activeMatchAsPlayer2 = await ctx.db
      .query("matches")
      .withIndex("by_userId2_status", (q) => 
        q.eq("userId2", userId).eq("status", "waiting")
      )
      .first();

    if (activeMatchAsPlayer1 || activeMatchAsPlayer2) {
      throw new Error("You are already in an active match queue");
    }

    // Find the first waiting match for this problem
    const waitingMatch = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .filter((q) => q.eq(q.field("problemId"), problemId))
      .first();

    if (!waitingMatch) {
      throw new Error("No waiting match found for this problem");
    }

    // Don't allow joining your own match
    if (waitingMatch.userId1 === userId) {
      throw new Error("Cannot join your own match");
    }

    // Join the match and start it
    await ctx.db.patch(waitingMatch._id, {
      userId2: userId,
      status: "in-progress",
      startedAt: Date.now(),
    });

    return waitingMatch._id;
  },
});

// Get a specific match by ID
export const getMatch = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.matchId);
  },
});

// Subscribe to match updates (real-time)
export const subscribeToMatch = query({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.matchId);
  },
});

// Get all matches for a user (both as player1 and player2)
export const getUserMatches = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get matches where user is player1
    const asPlayer1 = await ctx.db
      .query("matches")
      .withIndex("by_userId1", (q) => q.eq("userId1", userId))
      .collect();

    // Get matches where user is player2
    const asPlayer2 = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("userId2"), userId))
      .collect();

    // Combine and sort by creation date
    const allMatches = [...asPlayer1, ...asPlayer2].sort(
      (a, b) => b.createdAt - a.createdAt
    );

    return allMatches;
  },
});

// Get waiting matches for a specific problem
export const getWaitingMatches = query({
  args: { problemId: v.string() },
  handler: async (ctx, args) => {
    const { problemId } = args;

    return await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .filter((q) => q.eq(q.field("problemId"), problemId))
      .collect();
  },
});

// Update match status (when someone wins, forfeits, etc.)
export const updateMatchStatus = mutation({
  args: {
    matchId: v.id("matches"),
    status: v.string(),
    winnerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { matchId, status, winnerId } = args;

    const updateData: any = { status };
    
    if (winnerId) {
      updateData.winnerId = winnerId;
    }

    if (status === "completed" || status === "forfeited") {
      updateData.completedAt = Date.now();
    }

    await ctx.db.patch(matchId, updateData);
  },
});

// Mark a match as won by a specific player
export const markMatchWon = mutation({
  args: {
    matchId: v.id("matches"),
    winnerId: v.string(),
  },
  handler: async (ctx, args) => {
    const { matchId, winnerId } = args;

    await ctx.db.patch(matchId, {
      status: "completed",
      winnerId,
      completedAt: Date.now(),
    });
  },
});

// Forfeit a match (when a player leaves)
export const forfeitMatch = mutation({
  args: {
    matchId: v.id("matches"),
    userId: v.string(),
    reason: v.optional(v.string()), // "left_page", "switched_tab", etc.
  },
  handler: async (ctx, args) => {
    const { matchId, userId, reason } = args;

    const match = await ctx.db.get(matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    // Determine the winner (the other player)
    const winnerId = match.userId1 === userId ? match.userId2 : match.userId1;

    await ctx.db.patch(matchId, {
      status: "forfeited",
      winnerId,
      completedAt: Date.now(),
      forfeitReason: reason || "left_match",
    });
  },
});

// Cancel a match (when a player leaves) new function for the overlay waiting screen
export const cancelMatch = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Check if user is player1 in a waiting match
    const matchAsPlayer1 = await ctx.db
      .query("matches")
      .withIndex("by_userId1_status", (q) => 
        q.eq("userId1", userId).eq("status", "waiting")
      )
      .first();

    // Check if user is player2 in a waiting match
    const matchAsPlayer2 = await ctx.db
      .query("matches")
      .withIndex("by_userId2_status", (q) => 
        q.eq("userId2", userId).eq("status", "waiting")
      )
      .first();

    if (matchAsPlayer1) {
      await ctx.db.delete(matchAsPlayer1._id);
      return { success: true, matchId: matchAsPlayer1._id };
    }

    if (matchAsPlayer2) {
      await ctx.db.delete(matchAsPlayer2._id);
      return { success: true, matchId: matchAsPlayer2._id };
    }

    return { success: false, message: "No active match found" };
  },
});

// Query to check if user has any active matches (for frontend validation)
export const getUserActiveMatch = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Check if user is player1 in an active match
    const activeMatchAsPlayer1 = await ctx.db
      .query("matches")
      .withIndex("by_userId1_status", (q) => 
        q.eq("userId1", userId).eq("status", "waiting")
      )
      .first();

    // Check if user is player2 in an active match
    const activeMatchAsPlayer2 = await ctx.db
      .query("matches")
      .withIndex("by_userId2_status", (q) => 
        q.eq("userId2", userId).eq("status", "waiting")
      )
      .first();

    return activeMatchAsPlayer1 || activeMatchAsPlayer2 || null;
  },
});

// Get Arena Mode statistics for a user
export const getUserArenaStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get all matches for the user
    const userMatches = await ctx.db
      .query("matches")
      .withIndex("by_userId1", (q) => q.eq("userId1", userId))
      .collect();

    const userMatchesAsPlayer2 = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("userId2"), userId))
      .collect();

    const allMatches = [...userMatches, ...userMatchesAsPlayer2];

    // Calculate stats
    const totalMatches = allMatches.length;
    const wins = allMatches.filter(match => match.winnerId === userId).length;
    const losses = allMatches.filter(match => 
      match.status === 'completed' && match.winnerId !== userId
    ).length;
    const forfeits = allMatches.filter(match => 
      match.status === 'forfeited' && match.winnerId !== userId
    ).length;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    // Get recent matches (last 5)
    const recentMatches = allMatches
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    return {
      totalMatches,
      wins,
      losses,
      forfeits,
      winRate,
      recentMatches
    };
  },
});

// Get leaderboard - top 20 players by wins
export const getLeaderboard = query({
  args: {},
  handler: async (ctx, args) => {
    // Get all matches
    const allMatches = await ctx.db.query("matches").collect();
    
    // Calculate wins for each user
    const userWins: { [userId: string]: number } = {};
    const userTotalMatches: { [userId: string]: number } = {};
    
    allMatches.forEach(match => {
      // Count total matches for each user
      if (match.userId1) {
        userTotalMatches[match.userId1] = (userTotalMatches[match.userId1] || 0) + 1;
      }
      if (match.userId2) {
        userTotalMatches[match.userId2] = (userTotalMatches[match.userId2] || 0) + 1;
      }
      
      // Count wins
      if (match.winnerId) {
        userWins[match.winnerId] = (userWins[match.winnerId] || 0) + 1;
      }
    });
    
    // Convert to array and sort by wins
    const leaderboard = Object.keys(userWins).map(userId => ({
      userId,
      wins: userWins[userId],
      totalMatches: userTotalMatches[userId] || 0,
      winRate: userTotalMatches[userId] ? Math.round((userWins[userId] / userTotalMatches[userId]) * 100) : 0
    }));
    
    // Sort by wins (descending), then by win rate (descending)
    leaderboard.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.winRate - a.winRate;
    });
    
    // Get top 20
    const top20 = leaderboard.slice(0, 20);
    
    // Get user details for top 20
    const userDetails = await Promise.all(
      top20.map(async (entry) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_userId", (q) => q.eq("userId", entry.userId))
          .first();
        
        return {
          ...entry,
          username: user?.username || `User ${entry.userId.slice(0, 8)}`,
          joinedAt: user?.joinedAt
        };
      })
    );
    
    return userDetails;
  },
});