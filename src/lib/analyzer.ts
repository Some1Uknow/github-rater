import { GitHubData, AnalysisResult, Badge, LanguageSkill } from "./types";

const ARCHETYPES = [
  { name: "Open Source Samurai", desc: "A warrior of the open source realm, contributing to the greater good" },
  { name: "Night Owl Coder", desc: "Thrives in the darkness, shipping code while the world sleeps" },
  { name: "Full Stack Wizard", desc: "Master of all layers, from database to UI" },
  { name: "Bug Slayer", desc: "Hunts down bugs with ruthless efficiency" },
  { name: "Documentation Sage", desc: "The rare developer who actually writes docs" },
  { name: "Refactor Ninja", desc: "Silently improves code quality without breaking anything" },
  { name: "Framework Hopper", desc: "Always chasing the newest shiny technology" },
  { name: "Legacy Code Whisperer", desc: "Can understand and maintain ancient codebases" },
  { name: "API Architect", desc: "Designs elegant interfaces between systems" },
  { name: "DevOps Shaman", desc: "Bridges the gap between development and operations" },
  { name: "Data Sorcerer", desc: "Transforms raw data into valuable insights" },
  { name: "Security Guardian", desc: "Protects code from the forces of evil" },
  { name: "Performance Alchemist", desc: "Turns slow code into lightning-fast solutions" },
  { name: "Startup Hustler", desc: "Ships fast, breaks things, iterates quickly" },
  { name: "Enterprise Engineer", desc: "Builds robust, scalable systems for the long haul" },
];

const SPIRIT_ANIMALS = [
  "Phoenix", "Dragon", "Wolf", "Owl", "Fox", "Tiger", "Eagle", "Shark",
  "Octopus", "Raven", "Bear", "Panther", "Hawk", "Cobra", "Lion"
];

const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

const CODING_STYLES = [
  "Minimalist Perfectionist", "Verbose Documenter", "Pragmatic Shipper",
  "Clean Code Evangelist", "Hack-and-Slash", "Test-Driven Purist",
  "Copy-Paste Engineer", "Architecture Astronaut", "YOLO Deployer"
];

const WORK_PATTERNS = [
  "Deep Focus Marathoner", "Pomodoro Practitioner", "Burst Coder",
  "Steady Stream", "Weekend Warrior", "Early Bird", "Night Owl",
  "Deadline Driven", "Flow State Seeker"
];

const ROASTS = [
  "Your commit messages are so vague, they could be fortune cookies.",
  "You have more abandoned repos than a ghost town has tumbleweeds.",
  "Your code is like a mystery novel - nobody knows what's going on, including you.",
  "You fork repos like you're collecting Pokémon, but never evolve them.",
  "Your README files are shorter than a tweet from 2006.",
  "You push to main like you're playing Russian roulette with your career.",
  "Your contribution graph looks like a barcode for sadness.",
  "You have more TODO comments than actual code.",
  "Your variable names are so cryptic, even the NSA gave up decoding them.",
  "You treat version control like a diary - one commit per existential crisis.",
];

const PRAISES = [
  "Your code is cleaner than a freshly formatted hard drive.",
  "You're the developer other developers aspire to be.",
  "Your commit history reads like a well-organized novel.",
  "You actually write tests. You're basically a unicorn.",
  "Your documentation is so good, it brings tears to my eyes.",
  "You're the reason open source thrives.",
  "Your code reviews are legendary - firm but fair.",
  "You ship features faster than Amazon ships packages.",
  "Your architecture decisions will be studied in textbooks.",
  "You're proof that great developers do exist.",
];

const MOTTOS = [
  "Talk is cheap. Show me the code.",
  "It works on my machine.",
  "I'll fix it in the next sprint.",
  "Documentation is for quitters.",
  "Sleep is for the weak.",
  "Move fast and break things.",
  "Measure twice, code once.",
  "Keep it simple, stupid.",
  "There's no place like 127.0.0.1",
  "sudo make me a sandwich.",
];

function calculatePowerLevel(data: GitHubData): number {
  const { user, repos } = data;
  
  // Calculate totals from repos if not provided
  const totalStars = data.totalStars ?? repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = data.totalForks ?? repos.reduce((sum, r) => sum + r.forks_count, 0);
  
  let power = 0;
  
  // Base power from account age (max 1000)
  const accountAge = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);
  power += Math.min(accountAge * 100, 1000);
  
  // Power from repos (max 2000)
  power += Math.min(repos.length * 50, 2000);
  
  // Power from stars (max 3000)
  power += Math.min(totalStars * 10, 3000);
  
  // Power from forks (max 1500)
  power += Math.min(totalForks * 15, 1500);
  
  // Power from followers (max 2000)
  power += Math.min(user.followers * 5, 2000);
  
  // Power from language diversity (max 500)
  const languageCount = Object.keys(data.languages).length;
  power += Math.min(languageCount * 50, 500);
  
  return Math.round(power);
}

function getRank(power: number): { rank: string; title: string; percentile: number } {
  if (power >= 9000) return { rank: "S+", title: "LEGENDARY DEVELOPER", percentile: 99.9 };
  if (power >= 7000) return { rank: "S", title: "ELITE CODER", percentile: 99 };
  if (power >= 5000) return { rank: "A+", title: "SENIOR ARCHITECT", percentile: 95 };
  if (power >= 3500) return { rank: "A", title: "EXPERIENCED DEV", percentile: 85 };
  if (power >= 2500) return { rank: "B+", title: "SOLID CONTRIBUTOR", percentile: 70 };
  if (power >= 1500) return { rank: "B", title: "GROWING DEVELOPER", percentile: 50 };
  if (power >= 800) return { rank: "C+", title: "ASPIRING CODER", percentile: 30 };
  if (power >= 400) return { rank: "C", title: "CODE APPRENTICE", percentile: 15 };
  return { rank: "D", title: "FRESH SPAWN", percentile: 5 };
}

function generateBadges(data: GitHubData): Badge[] {
  const badges: Badge[] = [];
  const { user, repos, languages } = data;
  const totalStars = data.totalStars ?? repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  
  // Account age badges
  const accountAge = (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365);
  if (accountAge >= 10) badges.push({ id: "og-developer", name: "OG Developer", rarity: "Legendary", icon: "🎖️", description: "10+ years on GitHub" });
  else if (accountAge >= 5) badges.push({ id: "veteran", name: "Veteran Coder", rarity: "Epic", icon: "⭐", description: "5+ years on GitHub" });
  else if (accountAge >= 2) badges.push({ id: "established", name: "Established Dev", rarity: "Rare", icon: "🏅", description: "2+ years on GitHub" });
  
  // Star badges
  if (totalStars >= 10000) badges.push({ id: "star-lord", name: "Star Lord", rarity: "Mythic", icon: "👑", description: "10K+ total stars" });
  else if (totalStars >= 1000) badges.push({ id: "rising-star", name: "Rising Star", rarity: "Legendary", icon: "🌟", description: "1K+ total stars" });
  else if (totalStars >= 100) badges.push({ id: "stargazer", name: "Stargazer", rarity: "Epic", icon: "✨", description: "100+ total stars" });
  
  // Follower badges
  if (user.followers >= 10000) badges.push({ id: "influencer", name: "Tech Influencer", rarity: "Mythic", icon: "📢", description: "10K+ followers" });
  else if (user.followers >= 1000) badges.push({ id: "thought-leader", name: "Thought Leader", rarity: "Legendary", icon: "🎤", description: "1K+ followers" });
  else if (user.followers >= 100) badges.push({ id: "community-voice", name: "Community Voice", rarity: "Epic", icon: "🗣️", description: "100+ followers" });
  
  // Repo badges
  if (repos.length >= 100) badges.push({ id: "repo-hoarder", name: "Repo Hoarder", rarity: "Epic", icon: "📦", description: "100+ repositories" });
  else if (repos.length >= 50) badges.push({ id: "prolific", name: "Prolific Creator", rarity: "Rare", icon: "🏭", description: "50+ repositories" });
  
  // Language badges
  const langCount = Object.keys(languages).length;
  if (langCount >= 10) badges.push({ id: "polyglot", name: "Polyglot Master", rarity: "Legendary", icon: "🌐", description: "10+ languages used" });
  else if (langCount >= 5) badges.push({ id: "multilingual", name: "Multilingual Dev", rarity: "Rare", icon: "🗺️", description: "5+ languages used" });
  
  // Special language badges
  if (languages["Rust"]) badges.push({ id: "rustacean", name: "Rustacean", rarity: "Rare", icon: "🦀", description: "Writes Rust code" });
  if (languages["Go"]) badges.push({ id: "gopher", name: "Gopher", rarity: "Rare", icon: "🐹", description: "Writes Go code" });
  if (languages["TypeScript"]) badges.push({ id: "type-safe", name: "Type Safe", rarity: "Uncommon", icon: "🛡️", description: "Uses TypeScript" });
  if (languages["Python"]) badges.push({ id: "pythonista", name: "Pythonista", rarity: "Common", icon: "🐍", description: "Writes Python code" });
  if (languages["JavaScript"]) badges.push({ id: "js-warrior", name: "JS Warrior", rarity: "Common", icon: "⚡", description: "Writes JavaScript" });
  
  // Bio badge
  if (user.bio && user.bio.length > 50) badges.push({ id: "storyteller", name: "Storyteller", rarity: "Uncommon", icon: "📝", description: "Has a detailed bio" });
  
  // Following ratio
  if (user.followers > 0 && user.following === 0) badges.push({ id: "lone-wolf", name: "Lone Wolf", rarity: "Rare", icon: "🐺", description: "Follows no one" });
  if (user.followers > user.following * 10) badges.push({ id: "celebrity", name: "GitHub Celebrity", rarity: "Epic", icon: "🌟", description: "10x follower ratio" });
  
  return badges.slice(0, 8); // Max 8 badges
}

function generateLanguageSkills(languages: Record<string, number>, repos: GitHubData["repos"]): Record<string, LanguageSkill> {
  const skills: Record<string, LanguageSkill> = {};
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  
  for (const [lang, bytes] of Object.entries(languages)) {
    const percentage = (bytes / totalBytes) * 100;
    const projectCount = repos.filter(r => r.language === lang).length;
    
    let level = Math.min(Math.round(percentage * 2 + projectCount * 5), 100);
    let mastery = "Novice";
    let linesEstimate = "1K+";
    
    if (level >= 90) { mastery = "Godlike"; linesEstimate = "100K+"; }
    else if (level >= 75) { mastery = "Master"; linesEstimate = "50K+"; }
    else if (level >= 60) { mastery = "Expert"; linesEstimate = "25K+"; }
    else if (level >= 40) { mastery = "Proficient"; linesEstimate = "10K+"; }
    else if (level >= 20) { mastery = "Intermediate"; linesEstimate = "5K+"; }
    
    skills[lang] = { level, projects: projectCount, linesEstimate, mastery };
  }
  
  return skills;
}

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function analyzeGitHubData(data: GitHubData): AnalysisResult {
  const { user, repos, languages } = data;
  
  // Calculate totals from repos if not provided
  const totalStars = data.totalStars ?? repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = data.totalForks ?? repos.reduce((sum, r) => sum + r.forks_count, 0);
  
  const power = calculatePowerLevel(data);
  const { rank, title, percentile } = getRank(power);
  const archetype = random(ARCHETYPES);
  
  // Calculate breakdown scores
  const codeQuality = Math.min(Math.round((totalStars / Math.max(repos.length, 1)) * 10 + 50), 100);
  const consistency = Math.min(Math.round(repos.length * 2 + 30), 100);
  const influence = Math.min(Math.round(Math.log10(user.followers + 1) * 25), 100);
  const diversity = Math.min(Object.keys(languages).length * 10, 100);
  const communityImpact = Math.min(Math.round((totalForks / Math.max(repos.length, 1)) * 20 + 30), 100);
  
  // Find most starred repo
  const sortedRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
  const mostStarred = sortedRepos[0] ? {
    name: sortedRepos[0].name,
    stars: sortedRepos[0].stargazers_count,
    description: sortedRepos[0].description || "No description"
  } : null;
  
  // Get top topics
  const topicCounts: Record<string, number> = {};
  repos.forEach(repo => {
    repo.topics?.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);
  
  // Calculate follower ratio
  const followerRatio = user.following === 0 
    ? "∞" 
    : (user.followers / user.following).toFixed(1);
  
  // Estimate reach
  let estimatedReach = "< 100 developers";
  if (user.followers >= 10000) estimatedReach = "1M+ developers";
  else if (user.followers >= 1000) estimatedReach = "100K+ developers";
  else if (user.followers >= 100) estimatedReach = "10K+ developers";
  else if (user.followers >= 10) estimatedReach = "1K+ developers";
  
  // Generate fun facts
  const funFacts = [
    `Has mass than ${Math.round(repos.length * 1.5)} average developers combined`,
    `Could fill ${Math.round(totalStars / 10)} coffee cups with star power`,
    repos.length > 20 ? "Has more repos than most developers have commits" : "Quality over quantity approach",
    user.followers > user.following ? "More popular than a JavaScript framework" : "Humble and grounded",
    Object.keys(languages).length > 5 ? "Speaks more languages than a UN translator" : "Focused specialist",
  ];
  
  // Determine hiring verdict
  let shouldYouHire = "Worth interviewing";
  let trustWithProduction = "With supervision";
  if (power >= 7000) { shouldYouHire = "Hire immediately"; trustWithProduction = "Absolutely"; }
  else if (power >= 5000) { shouldYouHire = "Strong candidate"; trustWithProduction = "Yes, with code review"; }
  else if (power >= 3000) { shouldYouHire = "Promising talent"; trustWithProduction = "For non-critical systems"; }
  else if (power < 1000) { shouldYouHire = "Needs more experience"; trustWithProduction = "Staging only"; }
  
  return {
    meta: {
      analyzedAt: new Date().toISOString(),
      githubUsername: user.login,
      dataFreshness: "real-time",
      analysisVersion: "2.0"
    },
    powerLevel: {
      overall: power,
      breakdown: { codeQuality, consistency, influence, diversity, communityImpact },
      rank,
      percentile,
      title
    },
    archetype: {
      primary: archetype.name,
      secondary: random(ARCHETYPES.filter(a => a.name !== archetype.name)).name,
      spiritAnimal: random(SPIRIT_ANIMALS),
      alignment: random(ALIGNMENTS),
      description: archetype.desc
    },
    personality: {
      codingStyle: random(CODING_STYLES),
      workPattern: random(WORK_PATTERNS),
      communicationStyle: user.bio ? "Expressive" : "Reserved",
      teamRole: power >= 5000 ? "Tech Lead" : power >= 3000 ? "Senior Dev" : "Team Member",
      motto: random(MOTTOS)
    },
    skills: {
      languages: generateLanguageSkills(languages, repos),
      domains: {
        "Web Development": languages["JavaScript"] || languages["TypeScript"] ? 80 : 40,
        "Backend": languages["Python"] || languages["Java"] || languages["Go"] ? 75 : 35,
        "Systems": languages["C"] || languages["C++"] || languages["Rust"] ? 70 : 25,
        "Data Science": languages["Python"] || languages["R"] || languages["Julia"] ? 65 : 20,
        "Mobile": languages["Swift"] || languages["Kotlin"] || languages["Dart"] ? 60 : 15,
      },
      softSkills: {
        codeReview: Math.min(50 + repos.length, 95),
        documentation: repos.some(r => r.description && r.description.length > 50) ? 70 : 40,
        mentoring: Math.min(30 + Math.round(user.followers / 10), 90),
        projectManagement: repos.length > 20 ? 75 : 50
      }
    },
    activity: {
      totalCommits: repos.length * 50, // Estimate
      avgCommitsPerWeek: Math.round(repos.length * 2),
      longestStreak: Math.round(Math.random() * 100 + 20),
      currentStreak: Math.round(Math.random() * 30),
      mostActiveDay: random(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
      mostActiveHour: Math.round(Math.random() * 12 + 9),
      timezoneGuess: "UTC-5 (Eastern)",
      nightOwlScore: Math.round(Math.random() * 100),
      weekendWarriorScore: Math.round(Math.random() * 100),
      consistencyScore: consistency,
      burnoutRisk: consistency > 80 ? "Low" : consistency > 50 ? "Medium" : "High",
      pattern: {
        type: consistency > 70 ? "Steady Contributor" : "Burst Coder",
        description: consistency > 70 
          ? "Maintains consistent output without extreme spikes"
          : "Codes in intense bursts followed by quiet periods"
      }
    },
    repositories: {
      total: repos.length,
      totalStars,
      totalForks,
      avgStarsPerRepo: repos.length > 0 ? Math.round(totalStars / repos.length) : 0,
      mostStarred,
      topTopics,
      hasReadmePercent: 75, // Estimate
      hasLicensePercent: 60, // Estimate
      avgIssueResponseTime: "3 days",
      repoHealthScore: Math.min(50 + repos.length + Math.round(totalStars / 10), 100)
    },
    influence: {
      followers: user.followers,
      following: user.following,
      followerRatio,
      estimatedReach,
      industryImpact: power >= 7000 ? "Significant" : power >= 4000 ? "Notable" : "Growing",
      mentorScore: Math.min(30 + Math.round(user.followers / 5), 100),
      thoughtLeaderScore: Math.min(20 + Math.round(totalStars / 50), 100),
      viralRepos: repos.filter(r => r.stargazers_count > 100).length
    },
    badges: generateBadges(data),
    ropiast: {
      roast: random(ROASTS),
      praise: random(PRAISES),
      constructiveFeedback: repos.length < 10 
        ? "Consider creating more public projects to showcase your skills"
        : totalStars < 50 
        ? "Focus on promoting your best work to gain more visibility"
        : "Keep doing what you're doing, it's working!",
      motivationalQuote: power >= 5000 
        ? "You're already a legend. Now go mentor the next generation."
        : "Every expert was once a beginner. Keep pushing!"
    },
    comparisons: {
      similarTo: [
        power >= 7000 ? "Linus Torvalds" : power >= 5000 ? "Dan Abramov" : "A rising star",
        power >= 5000 ? "Evan You" : "Your future self",
        "That one senior dev everyone respects"
      ],
      betterThan: `${percentile}% of developers`,
      couldLearnFrom: power >= 9000 ? "No one on GitHub" : "The top 1%",
      peerGroup: title
    },
    predictions: {
      nextMilestone: user.followers < 100 ? "100 followers" : user.followers < 1000 ? "1K followers" : "10K followers",
      estimatedTimeToMilestone: "6-12 months",
      careerTrajectory: power >= 7000 ? "Already at peak - maintaining legend status" : "Upward trajectory",
      recommendedFocus: Object.keys(languages).length < 3 ? "Learn more languages" : "Deepen expertise",
      potentialGrowthAreas: ["Open source contributions", "Technical writing", "Community building"]
    },
    funFacts,
    verdict: {
      summary: `A ${title.toLowerCase()} with ${repos.length} repositories and ${totalStars} stars. ${archetype.desc}.`,
      emoji: power >= 7000 ? "👑🔥⚡" : power >= 4000 ? "⭐💪🚀" : "🌱📈✨",
      oneWord: power >= 7000 ? "LEGENDARY" : power >= 5000 ? "IMPRESSIVE" : power >= 3000 ? "SOLID" : "GROWING",
      shouldYouHire,
      wouldCollaborate: power >= 3000 ? "Absolutely" : "Worth considering",
      trustWithProduction
    },
    socialCard: {
      tagline: `${archetype.name} | ${title}`,
      colorTheme: power >= 7000 ? "gold" : power >= 4000 ? "purple" : "cyan",
      backgroundPattern: "matrix"
    }
  };
}
