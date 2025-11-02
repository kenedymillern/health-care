import { MongoClient, Db } from 'mongodb';
import retry from 'async-retry';

interface Cached {
  client: MongoClient | null;
  db: Db | null;
}

const cached: Cached = {
  client: null,
  db: null,
};

export async function connectToDatabase(): Promise<Db> {
  if (cached.client && cached.db) {
    return cached.db;
  }

  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://kennedy:1Millern@cluster0.j0lz7co.mongodb.net/?retryWrites=true&w=majority";
  const MONGODB_DB = process.env.MONGODB_DB || "homecare";

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  if (!MONGODB_DB) {
    throw new Error('MONGODB_DB is not defined in environment variables');
  }

  try {
    const client = await retry(
      async () => {
        const mongoClient = new MongoClient(MONGODB_URI, {
          serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });
        await mongoClient.connect();
        console.log('Connected to MongoDB');
        return mongoClient;
      },
      {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (err, attempt) => {
          console.warn(`MongoDB connection attempt ${attempt} failed:`, err);
        },
      }
    );

    cached.client = client;
    cached.db = client.db(MONGODB_DB);
    return cached.db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.client = null;
    cached.db = null;
    throw new Error('Failed to connect to database');
  }
}

// Gracefully close MongoDB connection on process termination
process.on('SIGTERM', async () => {
  if (cached.client) {
    await cached.client.close();
    console.log('MongoDB connection closed');
  }
});