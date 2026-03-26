import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getProblemById } from "../lib/problems";

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

export const getUserCoachInput = query({
  args: {
    userId: v.string(),
    // We only support a few fixed windows for cheaper & stable prompts.
    rangeDays: v.number(),
  },
  handler: async (ctx, args) => {
    const safeRangeDays = [7, 30, 90].includes(args.rangeDays) ? args.rangeDays : 30;

    const dayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();

    // Use UTC day boundaries so we don't get DST-related weirdness.
    const anchorDayStart = (() => {
      const d = new Date(now);
      d.setUTCHours(0, 0, 0, 0);
      return d.getTime();
    })();

    const rangeStart = anchorDayStart - (safeRangeDays - 1) * dayMs;
    const rangeEndExclusive = anchorDayStart + dayMs;

    // Start from the newest submissions for that user and cap the amount of data we process.
    const maxTake = safeRangeDays >= 90 ? 5000 : safeRangeDays >= 30 ? 3000 : 1500;
    const recentSubmissions = await ctx.db
      .query("submissions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(maxTake);

    const submissionsInRange = recentSubmissions.filter(
      (s) => s.submittedAt >= rangeStart && s.submittedAt < rangeEndExclusive,
    );

    // Fetch streak metadata so the AI can explain “why your streak drops matter”.
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const dailySeries = Array.from({ length: safeRangeDays }, (_, i) => {
      const dayStart = rangeStart + i * dayMs;
      return {
        dayStart,
        totalSubmissions: 0,
        correctSubmissions: 0,
        successRate: 0, // percent
        avgCorrectTime: 0, // seconds
        dominantLanguage: null as string | null,
      };
    });

    const perDayCorrectSum = Array.from({ length: safeRangeDays }, () => 0);
    const perDayLang = Array.from({ length: safeRangeDays }, () => new Map<string, { submissions: number; correct: number; correctTimeSum: number }>());
    const submissionsByDay = Array.from({ length: safeRangeDays }, () => [] as typeof submissionsInRange);

    for (const s of submissionsInRange) {
      const idx = Math.floor((s.submittedAt - rangeStart) / dayMs);
      if (idx < 0 || idx >= safeRangeDays) continue;

      dailySeries[idx].totalSubmissions += 1;
      submissionsByDay[idx].push(s);

      if (s.isCorrect) {
        dailySeries[idx].correctSubmissions += 1;
        dailySeries[idx].avgCorrectTime = 0; // computed later
        perDayCorrectSum[idx] += s.timeTaken;
      }

      const lang = s.language || "unknown";
      const langStats = perDayLang[idx].get(lang) || { submissions: 0, correct: 0, correctTimeSum: 0 };
      langStats.submissions += 1;
      if (s.isCorrect) {
        langStats.correct += 1;
        langStats.correctTimeSum += s.timeTaken;
      }
      perDayLang[idx].set(lang, langStats);
    }

    for (let i = 0; i < safeRangeDays; i++) {
      const attempts = dailySeries[i].totalSubmissions;
      const correct = dailySeries[i].correctSubmissions;

      if (attempts > 0) {
        dailySeries[i].successRate = Math.round((correct / attempts) * 10000) / 100;
      }

      if (correct > 0) {
        dailySeries[i].avgCorrectTime = Math.round((perDayCorrectSum[i] / correct) * 100) / 100;
      }

      // Dominant language by number of submissions for that day.
      let bestLang: string | null = null;
      let bestCount = -1;
      for (const [lang, st] of perDayLang[i]) {
        if (st.submissions > bestCount) {
          bestCount = st.submissions;
          bestLang = lang;
        }
      }
      dailySeries[i].dominantLanguage = bestLang;
    }

    // Overall language breakdown.
    const langTotals = new Map<string, { submissions: number; correct: number; correctTimeSum: number }>();
    for (const s of submissionsInRange) {
      const lang = s.language || "unknown";
      const st = langTotals.get(lang) || { submissions: 0, correct: 0, correctTimeSum: 0 };
      st.submissions += 1;
      if (s.isCorrect) {
        st.correct += 1;
        st.correctTimeSum += s.timeTaken;
      }
      langTotals.set(lang, st);
    }

    const languageBreakdown = Array.from(langTotals.entries())
      .map(([language, st]) => {
        const successRate = st.submissions > 0 ? Math.round((st.correct / st.submissions) * 10000) / 100 : 0;
        const avgCorrectTime =
          st.correct > 0 ? Math.round((st.correctTimeSum / st.correct) * 100) / 100 : 0;
        return { language, submissions: st.submissions, correctSubmissions: st.correct, successRate, avgCorrectTime };
      })
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 6);

    // Top tags overall (based on the tagged problem for each submission).
    const tagTotals = new Map<string, { attempts: number; solves: number; correctTimeSum: number }>();
    for (const s of submissionsInRange) {
      const problem = getProblemById(s.problemId);
      if (!problem) continue;

      for (const tag of problem.tags) {
        const st = tagTotals.get(tag) || { attempts: 0, solves: 0, correctTimeSum: 0 };
        st.attempts += 1;
        if (s.isCorrect) {
          st.solves += 1;
          st.correctTimeSum += s.timeTaken;
        }
        tagTotals.set(tag, st);
      }
    }

    const topTags = Array.from(tagTotals.entries())
      .map(([tag, st]) => {
        const successRate = st.attempts > 0 ? Math.round((st.solves / st.attempts) * 10000) / 100 : 0;
        return {
          tag,
          attempts: st.attempts,
          solves: st.solves,
          successRate,
          avgCorrectTime: st.solves > 0 ? Math.round((st.correctTimeSum / st.solves) * 100) / 100 : 0,
        };
      })
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 10);

    // Identify “streak drops” inside this range as: a day with 0 submissions after a day with >= 1 submission.
    const breakDayIndices: number[] = [];
    for (let i = 1; i < safeRangeDays; i++) {
      if (dailySeries[i].totalSubmissions === 0 && dailySeries[i - 1].totalSubmissions > 0) {
        breakDayIndices.push(i);
      }
    }

    const precedingDayIndices = breakDayIndices.map((i) => i - 1);

    const timesBeforeBreak: number[] = [];
    const langBeforeBreak = new Map<string, number>();
    const tagBeforeBreak = new Map<string, number>();

    for (const dayIdx of precedingDayIndices) {
      if (dailySeries[dayIdx].correctSubmissions > 0) {
        timesBeforeBreak.push(dailySeries[dayIdx].avgCorrectTime);
      }

      for (const s of submissionsByDay[dayIdx]) {
        const lang = s.language || "unknown";
        langBeforeBreak.set(lang, (langBeforeBreak.get(lang) || 0) + 1);

        const problem = getProblemById(s.problemId);
        if (!problem) continue;
        for (const tag of problem.tags) {
          tagBeforeBreak.set(tag, (tagBeforeBreak.get(tag) || 0) + 1);
        }
      }
    }

    const avgCorrectTimeBeforeBreak =
      timesBeforeBreak.length > 0
        ? Math.round((timesBeforeBreak.reduce((a, b) => a + b, 0) / timesBeforeBreak.length) * 100) / 100
        : 0;

    const languageBeforeBreakTop = Array.from(langBeforeBreak.entries())
      .map(([language, count]) => ({ language, submissions: count }))
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 4);

    const tagBeforeBreakTop = Array.from(tagBeforeBreak.entries())
      .map(([tag, count]) => ({ tag, mentions: count }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 6);

    const firstHalf = dailySeries.slice(0, Math.floor(safeRangeDays / 2)).filter((d) => d.correctSubmissions > 0);
    const lastHalf = dailySeries.slice(Math.floor(safeRangeDays / 2)).filter((d) => d.correctSubmissions > 0);
    const firstHalfAvg = firstHalf.length
      ? firstHalf.reduce((a, b) => a + b.avgCorrectTime, 0) / firstHalf.length
      : 0;
    const lastHalfAvg = lastHalf.length
      ? lastHalf.reduce((a, b) => a + b.avgCorrectTime, 0) / lastHalf.length
      : 0;

    const timeTrend =
      firstHalf.length === 0 || lastHalf.length === 0
        ? "insufficient_data"
        : lastHalfAvg < firstHalfAvg
          ? "improving"
          : lastHalfAvg > firstHalfAvg
            ? "worsening"
            : "flat";

    const totalSubmissions = submissionsInRange.length;
    const correctSubmissions = submissionsInRange.filter((s) => s.isCorrect).length;
    const successRate = totalSubmissions > 0 ? Math.round((correctSubmissions / totalSubmissions) * 10000) / 100 : 0;
    const avgTimeAll = totalSubmissions > 0 ? Math.round((submissionsInRange.reduce((a, b) => a + b.timeTaken, 0) / totalSubmissions) * 100) / 100 : 0;
    const avgCorrectTimeOverall =
      correctSubmissions > 0
        ? Math.round(
            (submissionsInRange.filter((s) => s.isCorrect).reduce((a, b) => a + b.timeTaken, 0) / correctSubmissions) * 100,
          ) / 100
        : 0;

    return {
      rangeDays: safeRangeDays,
      user: user
        ? { currentStreak: user.currentStreak, lastStreakUpdate: user.lastStreakUpdate }
        : null,
      totals: {
        totalSubmissions,
        correctSubmissions,
        successRate,
        avgTimeAll,
        avgCorrectTimeOverall,
      },
      dailySeries,
      languageBreakdown,
      topTags,
      streakDrops: {
        breakCountInRange: breakDayIndices.length,
        avgCorrectTimeBeforeBreak: avgCorrectTimeBeforeBreak,
        languageBeforeBreakTop,
        tagBeforeBreakTop,
      },
      timeTrend: {
        trend: timeTrend,
        firstHalfAvgCorrectTime: Math.round(firstHalfAvg * 100) / 100,
        lastHalfAvgCorrectTime: Math.round(lastHalfAvg * 100) / 100,
      },
    };
  },
});
