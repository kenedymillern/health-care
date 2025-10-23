import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

// Validate environment variables
if (!uri || !dbName) {
  throw new Error('MONGODB_URI and MONGODB_DB must be defined in .env.local');
}

// Global cache for MongoDB client and database
interface MongoCache {
  client: MongoClient | null;
  db: Db | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongo: MongoCache | undefined;
}

let cached: MongoCache = global.mongo || { client: null, db: null };

if (!global.mongo) {
  global.mongo = cached;
}

export async function connectToDatabase(): Promise<Db> {
  if (cached.db) {
    return cached.db;
  }

  try {
    if (!cached.client) {
      cached.client = new MongoClient(`${uri}`);
      await cached.client.connect();
      console.log('Connected to MongoDB');
    }
    cached.db = cached.client.db(dbName);
    return cached.db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.client = null;
    cached.db = null;
    throw new Error('Failed to connect to database');
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  if (cached.client) {
    await cached.client.close();
    cached.client = null;
    cached.db = null;
    console.log('MongoDB connection closed');
  }
}