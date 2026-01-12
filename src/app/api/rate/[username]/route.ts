import { NextResponse } from "next/server";
import { analyzeWithAI } from "@/lib/ai-analyzer";
import { getCachedAnalysis, saveAnalysisToCache, isMongoConfigured } from "@/lib/mongodb";
import { GitHubData } from "@/lib/types";
import { withRateLimit } from "@/lib/rate-limiter";
import { validateGitHubUsername, getSafeErrorMessage, RATE_LIMITS } from "@/lib/security";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchGitHubData(username: string): Promise<GitHubData> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  // Fetch user profile
  const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });

  if (!userResponse.ok) {
    if (userResponse.status === 404) {
      throw new Error("User not found");
    }
    if (userResponse.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to fetch user data");
  }

  const user = await userResponse.json();

  // Fetch repositories (up to 100)
  const reposResponse = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=stars&direction=desc`,
    { headers }
  );

  const repos = reposResponse.ok ? await reposResponse.json() : [];

  // Aggregate languages from repos
  const languages: Record<string, number> = {};
  for (const repo of repos.slice(0, 20)) {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + (repo.size || 1) * 1000;
    }
  }

  // Fetch recent activity
  const eventsResponse = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=30`,
    { headers }
  );

  const recentActivity = eventsResponse.ok ? await eventsResponse.json() : [];

  return {
    user,
    repos,
    languages,
    recentActivity,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  // Apply rate limiting
  return withRateLimit(request, RATE_LIMITS.ANALYSIS, async () => {
    try {
      const { username } = await params;

      // Validate username
      const validation = validateGitHubUsername(username);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      const normalizedUsername = username.toLowerCase().trim();

      // Check cache first if MongoDB is configured
      if (isMongoConfigured()) {
        const cached = await getCachedAnalysis(normalizedUsername);
        if (cached) {
          console.log(`Cache hit for ${normalizedUsername}`);
          return NextResponse.json({
            cached: true,
            githubData: cached.githubData,
            analysis: cached.analysis,
          });
        }
        console.log(`Cache miss for ${normalizedUsername}`);
      }

      // Fetch fresh GitHub data
      const githubData = await fetchGitHubData(username);

      // Generate analysis using AI
      const analysis = await analyzeWithAI(githubData);

      // Save to cache if MongoDB is configured
      if (isMongoConfigured()) {
        await saveAnalysisToCache(normalizedUsername, githubData, analysis);
        console.log(`Cached analysis for ${normalizedUsername}`);
      }

      return NextResponse.json({
        cached: false,
        githubData,
        analysis,
      });
    } catch (error) {
      console.error("Rate API error:", error);
      return NextResponse.json(
        { error: getSafeErrorMessage(error) },
        { status: 500 }
      );
    }
  });
}
