export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  fork: boolean;
  archived: boolean;
  has_wiki?: boolean;
  has_pages?: boolean;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    id: number;
    name: string;
  };
}

export interface GitHubData {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: Record<string, number>;
  recentActivity?: GitHubEvent[];
  totalStars?: number;
  totalForks?: number;
}

export interface PowerLevel {
  overall: number;
  breakdown: Record<string, number>;
  rank: string;
  percentile?: number;
  title: string;
}

export interface Archetype {
  primary: string;
  secondary: string;
  spiritAnimal: string;
  alignment: string;
  description: string;
}

export interface Personality {
  codingStyle: string;
  workPattern: string;
  communicationStyle?: string;
  teamRole: string;
  motto: string;
}

export interface LanguageSkill {
  level: number;
  projects: number;
  linesEstimate: string;
  mastery: string;
}

export interface Skills {
  languages: Record<string, LanguageSkill>;
  domains: Record<string, number>;
  softSkills: Record<string, number>;
}

export interface Activity {
  totalCommits?: number;
  avgCommitsPerWeek?: number;
  longestStreak?: number;
  currentStreak?: number;
  mostActiveDay: string;
  mostActiveHour?: number;
  timezoneGuess?: string;
  nightOwlScore: number;
  weekendWarriorScore?: number;
  consistencyScore?: number;
  burnoutRisk: string;
  pattern: {
    type: string;
    description: string;
  };
}

export interface Repositories {
  total: number;
  totalStars: number;
  totalForks: number;
  avgStarsPerRepo: number;
  mostStarred: {
    name: string;
    stars: number;
    description: string;
  } | null;
  topTopics?: string[];
  topLanguages?: string[];
  hasReadmePercent?: number;
  hasLicensePercent?: number;
  avgIssueResponseTime?: string;
  repoHealthScore?: number;
}

export interface Influence {
  followers: number;
  following: number;
  followerRatio: string;
  estimatedReach?: string;
  industryImpact?: string;
  mentorScore?: number;
  thoughtLeaderScore?: number;
  viralRepos: number;
}

export interface Badge {
  id: string;
  name: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Mythic";
  icon: string;
  description: string;
}

export interface RoastPraise {
  roast: string;
  praise: string;
  constructiveFeedback: string;
  motivationalQuote: string;
}

export interface Comparisons {
  similarTo: string[];
  betterThan: string;
  couldLearnFrom: string;
  peerGroup: string;
}

export interface Predictions {
  nextMilestone: string;
  estimatedTimeToMilestone: string;
  careerTrajectory: string;
  recommendedFocus: string;
  potentialGrowthAreas: string[];
}

export interface Verdict {
  summary: string;
  emoji: string;
  oneWord: string;
  shouldYouHire: string;
  wouldCollaborate: string;
  trustWithProduction: string;
}

export interface SocialCard {
  tagline: string;
  colorTheme: string;
  backgroundPattern: string;
}

// Make socialCard optional in AnalysisResult
export interface AnalysisResult {
  meta: {
    analyzedAt: string;
    githubUsername?: string;
    dataFreshness?: string;
    analysisVersion?: string;
    dataPoints?: number;
    confidence?: number;
  };
  powerLevel: PowerLevel;
  archetype: Archetype;
  personality: Personality;
  skills: Skills;
  activity: Activity;
  repositories: Repositories;
  influence: Influence;
  badges: Badge[];
  ropiast: RoastPraise;
  comparisons: Comparisons;
  predictions: Predictions;
  funFacts: string[];
  verdict: Verdict;
  socialCard?: SocialCard;
}
