import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import { GitHubData, AnalysisResult } from "./types";

// Get the AI model based on available API keys
function getAIModel() {
  // Prefer Groq (faster and generous free tier)
  if (process.env.GROQ_API_KEY) {
    console.log("Using Groq AI (moonshotai/kimi-k2-instruct-0905)");
    return groq("moonshotai/kimi-k2-instruct-0905");
  }

  // Fallback to Google Gemini
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log("Using Google Gemini (gemini-1.5-flash)");
    return google("gemini-2.5-flash-lite-preview-09-2025");
  }

  return null;
}

// Schema for AI-generated analysis
const analysisSchema = z.object({
  powerLevel: z.object({
    overall: z.number().min(0).max(10000),
    rank: z.enum(["F", "D", "C", "B", "A", "S", "SS", "SSS"]),
    title: z.string(),
    breakdown: z.object({
      Consistency: z.number().min(0).max(100),
      Impact: z.number().min(0).max(100),
      Diversity: z.number().min(0).max(100),
      Quality: z.number().min(0).max(100),
      Activity: z.number().min(0).max(100),
      Community: z.number().min(0).max(100),
    }),
  }),
  archetype: z.object({
    primary: z.string(),
    secondary: z.string(),
    description: z.string(),
    spiritAnimal: z.string(),
    alignment: z.string(),
  }),
  personality: z.object({
    codingStyle: z.string(),
    workPattern: z.string(),
    teamRole: z.string(),
    motto: z.string(),
  }),
  ropiast: z.object({
    roast: z.string(),
    praise: z.string(),
    constructiveFeedback: z.string(),
    motivationalQuote: z.string(),
  }),
  verdict: z.object({
    emoji: z.string(),
    oneWord: z.string(),
    summary: z.string(),
    shouldYouHire: z.string(),
    wouldCollaborate: z.string(),
    trustWithProduction: z.string(),
  }),
  comparisons: z.object({
    similarTo: z.array(z.string()),
    betterThan: z.array(z.string()),
    couldLearnFrom: z.array(z.string()),
    peerGroup: z.string(),
  }),
  predictions: z.object({
    nextMilestone: z.string(),
    estimatedTimeToMilestone: z.string(),
    careerTrajectory: z.string(),
    recommendedFocus: z.string(),
    potentialGrowthAreas: z.array(z.string()),
  }),
  funFacts: z.array(z.string()),
});

type AIAnalysis = z.infer<typeof analysisSchema>;

export async function analyzeWithAI(githubData: GitHubData): Promise<AnalysisResult> {
  const { user, repos, languages, recentActivity } = githubData;

  // Calculate base stats
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const mostStarredRepo = repos.reduce(
    (max, r) => (r.stargazers_count > (max?.stargazers_count || 0) ? r : max),
    repos[0]
  );

  // Prepare context for AI
  const context = `
GitHub User Analysis Request:

USER PROFILE:
- Username: ${user.login}
- Name: ${user.name || "Not provided"}
- Bio: ${user.bio || "No bio"}
- Company: ${user.company || "None"}
- Location: ${user.location || "Unknown"}
- Public Repos: ${user.public_repos}
- Followers: ${user.followers}
- Following: ${user.following}
- Account Created: ${user.created_at}
- Profile URL: ${user.html_url}

REPOSITORY STATS:
- Total Repositories Analyzed: ${repos.length}
- Total Stars: ${totalStars}
- Total Forks: ${totalForks}
- Most Starred Repo: ${mostStarredRepo?.name || "None"} (${mostStarredRepo?.stargazers_count || 0} stars)
- Average Stars per Repo: ${repos.length > 0 ? Math.round(totalStars / repos.length) : 0}

TOP REPOSITORIES:
${repos
      .slice(0, 10)
      .map(
        (r) =>
          `- ${r.name}: ${r.description || "No description"} (⭐${r.stargazers_count}, 🍴${r.forks_count}, ${r.language || "Unknown"})`
      )
      .join("\n")}

LANGUAGES USED:
${Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([lang, bytes]) => `- ${lang}: ${bytes} bytes`)
      .join("\n")}

RECENT ACTIVITY:
- Recent commits/events: ${recentActivity?.length || 0}
- Activity types: ${recentActivity ? [...new Set(recentActivity.map((e) => e.type))].join(", ") : "None"}

Please analyze this GitHub profile and generate a comprehensive, entertaining, and insightful analysis.
Be creative with the roast (funny but not mean), praise (genuine and specific), and archetype assignment.
The power level should reflect their actual impact and activity (0-10000 scale, 9000+ is legendary).
Make the analysis feel personalized based on their actual repos and contributions.
`;

  try {
    // Get AI model based on available API keys
    const model = getAIModel();

    if (!model) {
      console.log("No AI API key configured, using fallback analysis");
      return generateFallbackAnalysis(githubData);
    }

    const { object: aiAnalysis } = await generateObject({
      model,
      schema: analysisSchema,
      system: `You are an enthusiastic and positive GitHub profile analyzer with a fun, retro-futuristic personality. Your job is to celebrate developers' achievements while providing honest, constructive feedback.

KEY PRINCIPLES:
1. **Be Celebratory**: Building software is HARD. Anyone who ships code deserves recognition.
2. **Context Matters**: A developer with 1,000 stars is exceptional. 10,000+ stars is legendary. Even 100 stars means they've built something valuable.
3. **Power Level Scale** (0-10,000):
   - 9,000+: Absolute legends (Linux creators, framework authors, major OSS maintainers)
   - 7,000-9,000: Elite developers with significant impact
   - 5,000-7,000: Senior developers with proven track record
   - 3,000-5,000: Solid mid-level developers
   - 1,500-3,000: Promising early-career developers
   - <1,500: Beginners (still awesome for starting!)

4. **Roast Guidelines**:
   - Make it FUNNY and LIGHTHEARTED, never mean or discouraging
   - For high achievers (7k+ power): Playful teasing about their success or quirks
   - For mid-level (3k-7k power): Gentle humor about room for growth
   - For beginners (<3k power): Encouraging humor that celebrates their journey
   - Example good roast: "With 50k stars, you're either a genius or you've discovered the secret to cloning yourself. We suspect both."
   - Example bad roast: "Your code is terrible" or "You should give up"

5. **Praise Guidelines**:
   - Be SPECIFIC about what they've accomplished
   - Highlight their best repositories and actual impact
   - Recognize their unique strengths (languages, domains, community)
   - For 5k+ stars: Emphasize their exceptional achievement
   - For 1k+ stars: Celebrate their growing influence
   - For <1k stars: Encourage their potential and growth

6. **Archetype Assignment**:
   - Make it FUN and ASPIRATIONAL
   - Base it on their actual repos and activity patterns
   - Examples: "Open Source Architect", "Framework Wizard", "Systems Sorcerer", "Full-Stack Craftsman"
   - Match spirit animal to their coding style

7. **Constructive Feedback**:
   - Always include something ACTIONABLE and ENCOURAGING
   - Focus on opportunities, not deficiencies
   - Frame suggestions as "level up" opportunities

8. **Verdict Section**:
   - "shouldYouHire": Be generous. If they have 3k+ power, definitely worth hiring
   - "wouldCollaborate": Be enthusiastic for 2k+ power levels
   - "trustWithProduction": Be realistic but fair

9. **Fun Facts**:
   - Make them genuinely interesting and specific to the developer
   - Use actual numbers from their profile
   - Add humor without being mean

Remember: The goal is to make developers feel AWESOME about their work while giving them useful insights to grow. Even Linus Torvalds started somewhere. Celebrate the journey!`,
      prompt: context,
      temperature: 0.8,
    });

    // Merge AI analysis with calculated stats
    return buildFullAnalysis(githubData, aiAnalysis);
  } catch (error) {
    console.error("AI analysis failed, using fallback:", error);
    return generateFallbackAnalysis(githubData);
  }
}

function buildFullAnalysis(githubData: GitHubData, aiAnalysis: AIAnalysis): AnalysisResult {
  const { user, repos, languages } = githubData;

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const mostStarredRepo = repos.reduce(
    (max, r) => (r.stargazers_count > (max?.stargazers_count || 0) ? r : max),
    repos[0]
  );

  // Calculate language skills
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  const languageSkills: AnalysisResult["skills"]["languages"] = {};

  Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .forEach(([lang, bytes]) => {
      const percentage = Math.round((bytes / totalBytes) * 100);
      const level = Math.min(100, percentage * 2 + 20);
      const projectCount = repos.filter((r) => r.language === lang).length;

      let mastery = "Beginner";
      if (level >= 90) mastery = "Grandmaster";
      else if (level >= 75) mastery = "Expert";
      else if (level >= 60) mastery = "Advanced";
      else if (level >= 40) mastery = "Intermediate";

      languageSkills[lang] = {
        level,
        projects: projectCount,
        mastery,
        linesEstimate: `${Math.round(bytes / 50).toLocaleString()}`,
      };
    });

  // Calculate badges
  const badges = generateBadges(githubData);

  // Determine activity patterns
  const accountAge = Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  return {
    powerLevel: aiAnalysis.powerLevel,
    archetype: aiAnalysis.archetype,
    personality: aiAnalysis.personality,
    skills: {
      languages: languageSkills,
      domains: {
        Backend: Math.min(100, 40 + repos.filter((r) => ["Python", "Java", "Go", "Rust", "C", "C++"].includes(r.language || "")).length * 10),
        Frontend: Math.min(100, 40 + repos.filter((r) => ["JavaScript", "TypeScript", "Vue", "Svelte"].includes(r.language || "")).length * 10),
        DevOps: Math.min(100, 30 + repos.filter((r) => r.name.toLowerCase().includes("docker") || r.name.toLowerCase().includes("k8s")).length * 15),
        Systems: Math.min(100, 30 + repos.filter((r) => ["C", "C++", "Rust", "Assembly"].includes(r.language || "")).length * 15),
        Security: Math.min(100, 25 + repos.filter((r) => r.name.toLowerCase().includes("security") || r.name.toLowerCase().includes("crypto")).length * 20),
        Architecture: Math.min(100, 35 + Math.floor(totalStars / 1000)),
      },
      softSkills: {
        Leadership: Math.min(100, 30 + Math.floor(user.followers / 100)),
        Communication: Math.min(100, 40 + repos.filter((r) => r.description && r.description.length > 50).length * 5),
        Mentoring: Math.min(100, 30 + Math.floor(totalForks / 50)),
        Documentation: Math.min(100, 35 + repos.filter((r) => r.has_wiki || r.has_pages).length * 10),
        Collaboration: Math.min(100, 40 + Math.min(user.following, 50)),
        "Problem Solving": Math.min(100, 50 + repos.length * 2),
      },
    },
    repositories: {
      total: repos.length,
      totalStars,
      totalForks,
      avgStarsPerRepo: repos.length > 0 ? Math.round(totalStars / repos.length) : 0,
      mostStarred: mostStarredRepo
        ? {
          name: mostStarredRepo.name,
          stars: mostStarredRepo.stargazers_count,
          description: mostStarredRepo.description || "No description",
        }
        : null,
      topLanguages: Object.keys(languageSkills).slice(0, 5),
    },
    activity: {
      pattern: {
        type: accountAge > 5 ? "Veteran" : accountAge > 2 ? "Established" : "Rising",
        description: `Active for ${accountAge} years`,
      },
      mostActiveDay: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][Math.floor(Math.random() * 5)],
      nightOwlScore: Math.floor(Math.random() * 60) + 20,
      burnoutRisk: totalStars > 10000 ? "Low" : repos.length > 50 ? "Medium" : "Low",
    },
    influence: {
      followers: user.followers,
      following: user.following,
      followerRatio: user.following > 0 ? (user.followers / user.following).toFixed(2) : "∞",
      viralRepos: repos.filter((r) => r.stargazers_count > 100).length,
    },
    badges,
    ropiast: aiAnalysis.ropiast,
    verdict: aiAnalysis.verdict,
    comparisons: aiAnalysis.comparisons,
    predictions: aiAnalysis.predictions,
    funFacts: aiAnalysis.funFacts,
    meta: {
      analyzedAt: new Date().toISOString(),
      dataPoints: repos.length + Object.keys(languages).length,
      confidence: 0.85,
    },
  };
}

function generateBadges(githubData: GitHubData): AnalysisResult["badges"] {
  const { user, repos, languages } = githubData;
  const badges: AnalysisResult["badges"] = [];
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const accountAge = Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  // Star-based badges
  if (totalStars >= 100000) {
    badges.push({ id: "star-mythic", name: "Star Collector", icon: "🌟", rarity: "Mythic", description: "100k+ total stars" });
  } else if (totalStars >= 10000) {
    badges.push({ id: "star-legendary", name: "Star Magnet", icon: "⭐", rarity: "Legendary", description: "10k+ total stars" });
  } else if (totalStars >= 1000) {
    badges.push({ id: "star-epic", name: "Rising Star", icon: "✨", rarity: "Epic", description: "1k+ total stars" });
  }

  // Follower badges
  if (user.followers >= 100000) {
    badges.push({ id: "followers-mythic", name: "Open Source Royalty", icon: "👑", rarity: "Mythic", description: "100k+ followers" });
  } else if (user.followers >= 10000) {
    badges.push({ id: "followers-legendary", name: "Influencer", icon: "📢", rarity: "Legendary", description: "10k+ followers" });
  } else if (user.followers >= 1000) {
    badges.push({ id: "followers-epic", name: "Community Leader", icon: "🎯", rarity: "Epic", description: "1k+ followers" });
  }

  // Repo count badges
  if (repos.length >= 100) {
    badges.push({ id: "repos-legendary", name: "Institution Builder", icon: "🏛️", rarity: "Legendary", description: "100+ repositories" });
  } else if (repos.length >= 50) {
    badges.push({ id: "repos-epic", name: "Prolific Creator", icon: "🏭", rarity: "Epic", description: "50+ repositories" });
  }

  // Language diversity
  const langCount = Object.keys(languages).length;
  if (langCount >= 10) {
    badges.push({ id: "polyglot", name: "Polyglot", icon: "📚", rarity: "Rare", description: "10+ languages used" });
  }

  // Viral repo badge
  const viralRepos = repos.filter((r) => r.stargazers_count > 1000).length;
  if (viralRepos >= 5) {
    badges.push({ id: "viral-legendary", name: "Viral Sensation", icon: "🔥", rarity: "Legendary", description: "5+ repos with 1k+ stars" });
  } else if (viralRepos >= 1) {
    badges.push({ id: "viral-epic", name: "Viral Sensation", icon: "🔥", rarity: "Epic", description: "Repo with 1k+ stars" });
  }

  // Fork master
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  if (totalForks >= 10000) {
    badges.push({ id: "forks-legendary", name: "Octopus", icon: "🐙", rarity: "Legendary", description: "10k+ total forks" });
  }

  // Account age
  if (accountAge >= 10) {
    badges.push({ id: "veteran", name: "Veteran", icon: "🎂", rarity: "Rare", description: "10+ years on GitHub" });
  } else if (accountAge >= 5) {
    badges.push({ id: "veteran", name: "Veteran", icon: "🎂", rarity: "Uncommon", description: "5+ years on GitHub" });
  }

  // First commit (everyone gets this)
  badges.push({ id: "first-commit", name: "First Commit", icon: "🌱", rarity: "Common", description: "Started the journey" });

  return badges;
}

function generateFallbackAnalysis(githubData: GitHubData): AnalysisResult {
  const { user, repos, languages } = githubData;

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  // Calculate power level based on stats
  let powerLevel = 1000;
  powerLevel += Math.min(totalStars * 0.5, 4000);
  powerLevel += Math.min(user.followers * 0.1, 2000);
  powerLevel += Math.min(repos.length * 20, 1000);
  powerLevel += Math.min(Object.keys(languages).length * 50, 500);
  powerLevel = Math.min(Math.round(powerLevel), 10000);

  let rank: "F" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS" = "C";
  let title = "Code Apprentice";

  if (powerLevel >= 9000) { rank = "SSS"; title = "LEGENDARY ARCHITECT"; }
  else if (powerLevel >= 7500) { rank = "SS"; title = "Elite Developer"; }
  else if (powerLevel >= 6000) { rank = "S"; title = "Senior Craftsman"; }
  else if (powerLevel >= 4500) { rank = "A"; title = "Skilled Developer"; }
  else if (powerLevel >= 3000) { rank = "B"; title = "Rising Developer"; }
  else if (powerLevel >= 1500) { rank = "C"; title = "Code Apprentice"; }
  else if (powerLevel >= 500) { rank = "D"; title = "Beginner"; }
  else { rank = "F"; title = "Newbie"; }

  // Build the full analysis using the helper
  const fallbackAI: AIAnalysis = {
    powerLevel: {
      overall: powerLevel,
      rank,
      title,
      breakdown: {
        Consistency: Math.min(100, 30 + repos.length * 2),
        Impact: Math.min(100, 20 + Math.floor(totalStars / 100)),
        Diversity: Math.min(100, 20 + Object.keys(languages).length * 5),
        Quality: Math.min(100, 40 + Math.floor(totalStars / repos.length / 10) || 40),
        Activity: Math.min(100, 30 + repos.length),
        Community: Math.min(100, 20 + Math.floor(user.followers / 50)),
      },
    },
    archetype: {
      primary: totalStars > 10000 ? "Open Source Legend" : repos.length > 30 ? "Prolific Builder" : "Code Craftsman",
      secondary: Object.keys(languages)[0] ? `${Object.keys(languages)[0]} Specialist` : "Generalist",
      description: `A developer who has contributed ${repos.length} repositories and earned ${totalStars.toLocaleString()} stars.`,
      spiritAnimal: totalStars > 5000 ? "Phoenix" : repos.length > 20 ? "Wolf" : "Fox",
      alignment: "Chaotic Good",
    },
    personality: {
      codingStyle: repos.length > 50 ? "Architect" : "Craftsman",
      workPattern: "Consistent",
      teamRole: user.followers > user.following ? "Leader" : "Collaborator",
      motto: "Ship it!",
    },
    ropiast: {
      roast: `With ${repos.length} repos, you're either incredibly productive or have serious commitment issues with finishing projects. Your GitHub is like a graveyard of good intentions.`,
      praise: `${totalStars.toLocaleString()} stars don't lie - you're building things people actually want to use. Keep shipping!`,
      constructiveFeedback: "Consider focusing on fewer projects with more depth. Quality over quantity wins in the long run.",
      motivationalQuote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    },
    verdict: {
      emoji: powerLevel >= 5000 ? "🏆" : powerLevel >= 3000 ? "⭐" : "💪",
      oneWord: powerLevel >= 7000 ? "IMPRESSIVE" : powerLevel >= 4000 ? "SOLID" : "PROMISING",
      summary: `A ${rank}-rank developer with ${totalStars.toLocaleString()} stars and ${repos.length} repositories. ${powerLevel >= 5000 ? "Definitely someone to watch!" : "On the path to greatness!"}`,
      shouldYouHire: powerLevel >= 5000 ? "Absolutely" : powerLevel >= 3000 ? "Worth interviewing" : "Shows potential",
      wouldCollaborate: powerLevel >= 4000 ? "Yes" : "Maybe",
      trustWithProduction: powerLevel >= 6000 ? "Yes" : powerLevel >= 3000 ? "With supervision" : "Not yet",
    },
    comparisons: {
      similarTo: ["Other developers at this level"],
      betterThan: [`${Math.round(Math.min(powerLevel / 100, 95))}% of GitHub users`],
      couldLearnFrom: ["Senior open source maintainers"],
      peerGroup: rank + "-tier developers",
    },
    predictions: {
      nextMilestone: totalStars < 1000 ? "1,000 stars" : totalStars < 10000 ? "10,000 stars" : "100,000 stars",
      estimatedTimeToMilestone: "6-12 months",
      careerTrajectory: "Upward",
      recommendedFocus: "Building more impactful projects",
      potentialGrowthAreas: ["Open source contributions", "Technical writing", "Community building"],
    },
    funFacts: [
      `You've written approximately ${Object.values(languages).reduce((a, b) => a + b, 0).toLocaleString()} bytes of code`,
      `Your repos have been forked ${totalForks.toLocaleString()} times`,
      `You know ${Object.keys(languages).length} programming languages`,
    ],
  };

  return buildFullAnalysis(githubData, fallbackAI);
}
