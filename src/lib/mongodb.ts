import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "github-rater";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI environment variable");
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Cache interface
export interface CachedAnalysis {
  username: string;
  githubData: unknown;
  analysis: unknown;
  createdAt: Date;
  expiresAt: Date;
}

// Get cached analysis
export async function getCachedAnalysis(username: string): Promise<CachedAnalysis | null> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<CachedAnalysis>("analyses");
    
    const cached = await collection.findOne({
      username: username.toLowerCase(),
      expiresAt: { $gt: new Date() },
    });

    return cached;
  } catch (error) {
    console.error("Error getting cached analysis:", error);
    return null;
  }
}

// Save analysis to cache (expires in 24 hours)
export async function saveAnalysisToCache(
  username: string,
  githubData: unknown,
  analysis: unknown
): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<CachedAnalysis>("analyses");

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    await collection.updateOne(
      { username: username.toLowerCase() },
      {
        $set: {
          username: username.toLowerCase(),
          githubData,
          analysis,
          createdAt: now,
          expiresAt,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error saving analysis to cache:", error);
  }
}

// Check if MongoDB is configured
export function isMongoConfigured(): boolean {
  return !!process.env.MONGODB_URI;
}
