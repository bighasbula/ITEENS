import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Clerk user ID
    username: v.optional(v.string()), // Optional username if not in Clerk yet
    totalSolved: v.number(), // Total problems solved correctly
    currentStreak: v.number(), // Current streak of daily practice
    lastStreakUpdate: v.optional(v.number()), // Last date when streak was updated (start of day timestamp)
    bestTime: v.optional(v.number()), // Best time taken (in seconds) or null
    joinedAt: v.number(), // Timestamp when user joined
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),

  submissions: defineTable({
    userId: v.string(), // Clerk user ID
    problemId: v.string(), // Problem attempted
    isCorrect: v.boolean(), // Pass or fail
    timeTaken: v.number(), // Seconds spent
    hintsUsed: v.number(), // Number of hints used
    submittedAt: v.number(), // Timestamp of submission
    code: v.optional(v.string()), // Optional: store the submitted code
    language: v.optional(v.string()), // Optional: programming language used
    executionTime: v.optional(v.string()), // Optional: execution time from Judge0
    memory: v.optional(v.number()), // Optional: memory usage from Judge0
  })
    .index("by_userId", ["userId"])
    .index("by_problemId", ["problemId"])
    .index("by_userId_problemId", ["userId", "problemId"])
    .index("by_submittedAt", ["submittedAt"]),
});
