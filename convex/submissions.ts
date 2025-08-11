import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submit a solution and update user statistics
export const submitSolution = mutation({
  args: {
    userId: v.string(),
    problemId: v.string(),
    isCorrect: v.boolean(),
    timeTaken: v.number(),
    hintsUsed: v.number(),
    code: v.optional(v.string()),
    language: v.optional(v.string()),
    executionTime: v.optional(v.string()),
    memory: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const {
      userId,
      problemId,
      isCorrect,
      timeTaken,
      hintsUsed,
      code,
      language,
      executionTime,
      memory,
    } = args;
    
    // Insert submission record
    const submissionId = await ctx.db.insert("submissions", {
      userId,
      problemId,
      isCorrect,
      timeTaken,
      hintsUsed,
      submittedAt: Date.now(),
      code,
      language,
      executionTime,
      memory,
    });
    
    // Get current user stats
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Update user statistics
    const updates: any = {};
    
    if (isCorrect) {
      // Increment total solved
      updates.totalSolved = user.totalSolved + 1;
      
      // Update best time if this is better
      if (!user.bestTime || timeTaken < user.bestTime) {
        updates.bestTime = timeTaken;
      }
    }
    
    // Check if user has already submitted today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const todayStart = today.getTime();
    
    // Check if user has already submitted today (streak already updated today)
    if (user.lastStreakUpdate && user.lastStreakUpdate >= todayStart) {
      // User has already submitted today, don't update streak
      // Just return without changing streak
    } else {
      // Calculate days since last streak update
      let daysSinceLastUpdate = 0;
      if (user.lastStreakUpdate) {
        const diffTime = todayStart - user.lastStreakUpdate;
        daysSinceLastUpdate = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }
      
      if (!user.lastStreakUpdate || daysSinceLastUpdate === 1) {
        // First submission ever OR user submitted yesterday, continue/increment streak
        updates.currentStreak = user.currentStreak + 1;
        updates.lastStreakUpdate = todayStart;
      } else if (daysSinceLastUpdate === 0) {
        // User submitted today already, but somehow we're here - shouldn't happen
        // Don't update streak
      } else {
        // User missed one or more days, reset streak to 1 (for today)
        updates.currentStreak = 1;
        updates.lastStreakUpdate = todayStart;
      }
    }
    
    // Update user record
    await ctx.db.patch(user._id, updates);
    
    return {
      submissionId,
      userStats: {
        totalSolved: updates.totalSolved || user.totalSolved,
        currentStreak: updates.currentStreak,
        bestTime: updates.bestTime || user.bestTime,
      },
    };
  },
});

// Get submissions for a specific user
export const getUserSubmissions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    return await ctx.db
      .query("submissions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get submissions for a specific problem
export const getProblemSubmissions = query({
  args: { problemId: v.string() },
  handler: async (ctx, args) => {
    const { problemId } = args;
    
    return await ctx.db
      .query("submissions")
      .withIndex("by_problemId", (q) => q.eq("problemId", problemId))
      .order("desc")
      .collect();
  },
});

// Get user's submissions for a specific problem
export const getUserProblemSubmissions = query({
  args: { userId: v.string(), problemId: v.string() },
  handler: async (ctx, args) => {
    const { userId, problemId } = args;
    
    return await ctx.db
      .query("submissions")
      .withIndex("by_userId_problemId", (q) => 
        q.eq("userId", userId).eq("problemId", problemId)
      )
      .order("desc")
      .collect();
  },
});

// Get submission statistics for a user
export const getUserSubmissionStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    
    const totalSubmissions = submissions.length;
    const correctSubmissions = submissions.filter(s => s.isCorrect).length;
    const successRate = totalSubmissions > 0 ? (correctSubmissions / totalSubmissions) * 100 : 0;
    
    // Calculate average time for correct submissions
    const correctTimes = submissions
      .filter(s => s.isCorrect)
      .map(s => s.timeTaken);
    const averageTime = correctTimes.length > 0 
      ? correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length 
      : 0;
    
    return {
      totalSubmissions,
      correctSubmissions,
      successRate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
      averageTime: Math.round(averageTime * 100) / 100, // Round to 2 decimal places
    };
  },
});
