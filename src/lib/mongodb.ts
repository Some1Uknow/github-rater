import { MongoClient, Db, MongoClientOptions } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "github-rater";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI environment variable");
}

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000, // Fail fast if DB is unreachable
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  // TLS configuration for Vercel serverless environment
  tls: true,
  tlsAllowInvalidCertificates: false,
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
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
