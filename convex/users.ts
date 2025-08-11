import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a user record if it doesn't exist (runs on login)
export const createUserIfNotExists = mutation({
  args: {
    userId: v.string(),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, username } = args;
    
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    
    if (existingUser) {
      // User exists, but check if they need the lastStreakUpdate field
      if (existingUser.lastStreakUpdate === undefined) {
        // Update existing user with lastStreakUpdate field
        await ctx.db.patch(existingUser._id, {
          lastStreakUpdate: existingUser.joinedAt,
        });
        // Return updated user
        return await ctx.db.get(existingUser._id);
      }
      return existingUser;
    }
    
    // Create new user with default values
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const newUser = await ctx.db.insert("users", {
      userId,
      username,
      totalSolved: 0,
      currentStreak: 0,
      lastStreakUpdate: today.getTime(),
      bestTime: undefined,
      joinedAt: Date.now(),
    });
    
    return newUser;
  },
});

// Get user by ID
export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// Get user statistics
export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    
    if (!user) {
      return null;
    }
    
    // Get submission count
    const totalSubmissions = await ctx.db
      .query("submissions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    
    // Get recent submissions
    const recentSubmissions = await ctx.db
      .query("submissions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
    
    return {
      ...user,
      totalSubmissions: totalSubmissions.length,
      recentSubmissions,
    };
  },
});
