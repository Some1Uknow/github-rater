import { NextRequest, NextResponse } from "next/server";
import { GitHubData, GitHubUser, GitHubRepo } from "@/lib/types";
import { withRateLimit } from "@/lib/rate-limiter";
import { validateGitHubUsername, getSafeErrorMessage, RATE_LIMITS } from "@/lib/security";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  // Apply rate limiting
  return withRateLimit(request, RATE_LIMITS.GITHUB_FETCH, async () => {
    const { username } = await params;

    // Validate username
    const validation = validateGitHubUsername(username);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    try {
      // Fetch user data
      const userResponse = await fetch(
        `https://api.github.com/users/${username}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "GitHub-Rater-App",
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        }
      );

      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
        throw new Error(`GitHub API error: ${userResponse.status}`);
      }

      const user: GitHubUser = await userResponse.json();

      // Fetch repositories (up to 100)
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "GitHub-Rater-App",
          },
          next: { revalidate: 300 },
        }
      );

      if (!reposResponse.ok) {
        throw new Error(`GitHub API error: ${reposResponse.status}`);
      }

      const repos: GitHubRepo[] = await reposResponse.json();

      // Calculate language statistics
      const languages: Record<string, number> = {};
      let totalStars = 0;
      let totalForks = 0;

      for (const repo of repos) {
        if (!repo.fork) {
          totalStars += repo.stargazers_count;
          totalForks += repo.forks_count;

          if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + repo.size;
          }
        }
      }

      // Fetch detailed language stats for top repos (optional, for more accuracy)
      const topRepos = repos
        .filter((r) => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

      for (const repo of topRepos) {
        try {
          const langResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/languages`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "GitHub-Rater-App",
              },
              next: { revalidate: 300 },
            }
          );

          if (langResponse.ok) {
            const repoLangs = await langResponse.json();
            for (const [lang, bytes] of Object.entries(repoLangs)) {
              languages[lang] = (languages[lang] || 0) + (bytes as number);
            }
          }
        } catch {
          // Continue if individual repo language fetch fails
        }
      }

      const data: GitHubData = {
        user,
        repos: repos.filter((r) => !r.fork), // Exclude forks
        languages,
        totalStars,
        totalForks,
      };

      return NextResponse.json(data);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      return NextResponse.json(
        { error: getSafeErrorMessage(error) },
        { status: 500 }
      );
    }
  });
}
