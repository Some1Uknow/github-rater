/**
 * Security utilities for input validation and sanitization
 * Protects against injection attacks and malicious inputs
 */

/**
 * Validates GitHub username format
 * GitHub usernames can only contain alphanumeric characters and hyphens
 * Cannot start or end with a hyphen
 * Maximum length is 39 characters
 */
export function validateGitHubUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (!username || typeof username !== "string") {
    return { valid: false, error: "Username is required" };
  }

  // Trim whitespace
  const trimmed = username.trim();

  // Check length
  if (trimmed.length === 0) {
    return { valid: false, error: "Username cannot be empty" };
  }

  if (trimmed.length > 39) {
    return { valid: false, error: "Username too long (max 39 characters)" };
  }

  // GitHub username pattern: alphanumeric and hyphens only
  // Cannot start or end with hyphen
  const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

  if (!usernameRegex.test(trimmed)) {
    return {
      valid: false,
      error: "Invalid username format. Use only letters, numbers, and hyphens.",
    };
  }

  // Check for consecutive hyphens (GitHub doesn't allow this)
  if (trimmed.includes("--")) {
    return {
      valid: false,
      error: "Username cannot contain consecutive hyphens",
    };
  }

  return { valid: true };
}

/**
 * Sanitizes user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .trim()
    .replace(/[<>\"'&]/g, "") // Remove potentially dangerous characters
    .slice(0, 100); // Limit length
}

/**
 * Validates request origin to prevent CSRF
 */
export function validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false;

  try {
    const url = new URL(origin);
    return allowedOrigins.some(allowed => {
      if (allowed === "*") return true;
      if (allowed.startsWith("*.")) {
        // Wildcard subdomain matching
        const domain = allowed.slice(2);
        return url.hostname.endsWith(domain);
      }
      return url.hostname === allowed;
    });
  } catch {
    return false;
  }
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  // Strict limit for analysis endpoints (expensive operations)
  ANALYSIS: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // Increased to 20 for better dev experience
  },
  // Moderate limit for GitHub data fetching
  GITHUB_FETCH: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  },
  // Lenient limit for leaderboard (read-only)
  LEADERBOARD: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
} as const;

/**
 * Generates a safe error message that doesn't expose internal details
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Only expose specific known error messages
    const safeMessages = [
      "User not found",
      "Username is required",
      "Invalid username format",
      "Rate limit exceeded",
      "GitHub API rate limit exceeded",
    ];

    if (safeMessages.some(msg => error.message.includes(msg))) {
      return error.message;
    }
  }

  // Generic error message for everything else
  return "An error occurred while processing your request";
}

/**
 * Validates request body size to prevent payload attacks
 */
export function validateRequestSize(contentLength: string | null, maxSizeBytes: number = 1024 * 100): boolean {
  if (!contentLength) return true; // No content-length header

  const size = parseInt(contentLength, 10);
  if (isNaN(size)) return true;

  return size <= maxSizeBytes;
}
