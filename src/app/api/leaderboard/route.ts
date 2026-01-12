import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, isMongoConfigured } from "@/lib/mongodb";
import { withRateLimit } from "@/lib/rate-limiter";
import { getSafeErrorMessage, RATE_LIMITS } from "@/lib/security";
import { AnalysisResult } from "@/lib/types";

export interface LeaderboardEntry {
  username: string;
  powerLevel: number;
  rank: string;
  archetype: string;
  totalStars: number;
  followers: number;
  topLanguage: string;
  analyzedAt: string;
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  return withRateLimit(request, RATE_LIMITS.LEADERBOARD, async () => {
    try {
      // Check if MongoDB is configured
      if (!isMongoConfigured()) {
        return NextResponse.json(
          { error: "Leaderboard feature requires database configuration" },
          { status: 503 }
        );
      }

      // Get query parameters
      const searchParams = request.nextUrl.searchParams;
      const sortBy = searchParams.get("sortBy") || "powerLevel"; // powerLevel, stars, followers
      const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100); // Max 100
      const language = searchParams.get("language"); // Filter by language
      const archetype = searchParams.get("archetype"); // Filter by archetype

      const { db } = await connectToDatabase();
      const collection = db.collection("analyses");

      // Build aggregation pipeline
      const pipeline: Array<Object> = [
        // Only get non-expired entries
        {
          $match: {
            expiresAt: { $gt: new Date() },
          },
        },
      ];

      // Add language filter if specified
      if (language) {
        pipeline.push({
          $match: {
            "analysis.skills.languages": {
              $exists: true,
            },
          },
        });
      }

      // Add archetype filter if specified
      if (archetype) {
        pipeline.push({
          $match: {
            "analysis.archetype.primary": archetype,
          },
        });
      }

      // Project the fields we need
      pipeline.push({
        $project: {
          username: 1,
          powerLevel: "$analysis.powerLevel.overall",
          rank: "$analysis.powerLevel.rank",
          archetype: "$analysis.archetype.primary",
          totalStars: "$analysis.repositories.totalStars",
          followers: "$analysis.influence.followers",
          topLanguage: {
            $arrayElemAt: [
              {
                $map: {
                  input: { $objectToArray: "$analysis.skills.languages" },
                  as: "lang",
                  in: "$$lang.k",
                },
              },
              0,
            ],
          },
          analyzedAt: "$analysis.meta.analyzedAt",
        },
      });

      // Sort based on sortBy parameter
      const sortField =
        sortBy === "stars"
          ? "totalStars"
          : sortBy === "followers"
          ? "followers"
          : "powerLevel";

      pipeline.push({
        $sort: { [sortField]: -1 },
      });

      // Limit results
      pipeline.push({
        $limit: limit,
      });

      const results = await collection.aggregate(pipeline).toArray();

      // Transform results
      const leaderboard: LeaderboardEntry[] = results.map((entry: any) => ({
        username: entry.username,
        powerLevel: entry.powerLevel || 0,
        rank: entry.rank || "Unknown",
        archetype: entry.archetype || "Unknown",
        totalStars: entry.totalStars || 0,
        followers: entry.followers || 0,
        topLanguage: entry.topLanguage || "Unknown",
        analyzedAt: entry.analyzedAt || new Date().toISOString(),
      }));

      // Get total count for pagination info
      const totalCount = await collection.countDocuments({
        expiresAt: { $gt: new Date() },
      });

      return NextResponse.json({
        leaderboard,
        meta: {
          total: totalCount,
          limit,
          sortBy,
          filters: {
            language: language || null,
            archetype: archetype || null,
          },
        },
      });
    } catch (error) {
      console.error("Leaderboard API error:", error);
      return NextResponse.json(
        { error: getSafeErrorMessage(error) },
        { status: 500 }
      );
    }
  });
}
