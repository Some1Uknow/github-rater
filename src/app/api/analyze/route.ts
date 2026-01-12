import { NextResponse } from "next/server";
import { GitHubData } from "@/lib/types";
import { analyzeWithAI } from "@/lib/ai-analyzer";
import { getCachedAnalysis, saveAnalysisToCache, isMongoConfigured } from "@/lib/mongodb";
import { withRateLimit } from "@/lib/rate-limiter";
import { validateGitHubUsername, getSafeErrorMessage, RATE_LIMITS, validateRequestSize } from "@/lib/security";

export async function POST(request: Request) {
  // Apply rate limiting
  return withRateLimit(request, RATE_LIMITS.ANALYSIS, async () => {
    try {
      // Validate request size
      const contentLength = request.headers.get("content-length");
      if (!validateRequestSize(contentLength, 1024 * 500)) { // 500KB max
        return NextResponse.json(
          { error: "Request payload too large" },
          { status: 413 }
        );
      }

      const githubData: GitHubData = await request.json();

      if (!githubData || !githubData.user) {
        return NextResponse.json(
          { error: "Invalid GitHub data provided" },
          { status: 400 }
        );
      }

      // Validate username
      const validation = validateGitHubUsername(githubData.user.login);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      const username = githubData.user.login.toLowerCase().trim();

      // Check cache first if MongoDB is configured
      if (isMongoConfigured()) {
        const cached = await getCachedAnalysis(username);
        if (cached) {
          console.log(`Cache hit for ${username}`);
          return NextResponse.json(cached.analysis);
        }
        console.log(`Cache miss for ${username}`);
      }

      // Generate analysis using AI
      const analysis = await analyzeWithAI(githubData);

      // Save to cache if MongoDB is configured
      if (isMongoConfigured()) {
        await saveAnalysisToCache(username, githubData, analysis);
        console.log(`Cached analysis for ${username}`);
      }

      return NextResponse.json(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      return NextResponse.json(
        { error: getSafeErrorMessage(error) },
        { status: 500 }
      );
    }
  });
}
