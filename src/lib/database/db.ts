/**
 * MongoDB Connection Utility for Next.js Server
 *
 * This module provides a reusable and efficient MongoDB connection handler.
 * It prevents multiple database connections during development (due to HMR).
 *
 * Exposes:
 *  - getDB(): Returns a connected database instance
 *  - getCollection(): Returns a specific MongoDB collection
 *
 * Key features:
 *  - Uses a global cache to persist connections across hot reloads
 *  - Connects lazily (only when first accessed)
 *  - Reuses the same connection between requests
 */

import 'server-only'; // Ensures this module is only executed on the server
import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import type { Document } from 'mongodb'; // Provides typing support for collections/documents

//Load MongoDB URI from environment variables
const uri = process.env.DB_URI!;
// Throw an error if the URI is not found (helps catch setup issues early)
if (!uri) throw new Error('Mongo URI not found!');

// Name of the MongoDB database to connect to
const DB_NAME = 'avensia_cv_generator_db_dev';

//Type definition for the Mongo cache structure
type MongoCache = {
  client: MongoClient | null; // Cached MongoClient instance
  promise: Promise<MongoClient> | null; // Promise for an ongoing connection attempt
  db: Db | null; // Cached database instance
};

// Global cache to persist Mongo connection between hot reloads (development only)
// Prevents multiple connections when Next.js auto-restarts during file changes

// @ts-expect-error: global type not extended in Node.js type defs
const cached: MongoCache = global._mongoCache ?? { client: null, promise: null, db: null };

// @ts-expect-error: Define the cache globally if it doesn't exist yet
if (!global._mongoCache) global._mongoCache = cached;

/**
 * Get or create a MongoClient instance.
 * Ensures only one active connection exists and caches it for reuse.
 */
async function getClient(): Promise<MongoClient> {
  // Return cached client if already connected
  if (cached.client) return cached.client;

  // If no connection yet, create a new one and cache the connection promise
  if (!cached.promise) {
    cached.promise = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    }).connect();
  }

  // Wait for the connection to complete, then cache and return the client
  cached.client = await cached.promise;
  return cached.client;
}

/**
 * Get or create a connected MongoDB database instance.
 * Reuses cached client and DB to avoid redundant connections.
 */
export async function getDB(): Promise<Db> {
  // Return cached DB if already available
  if (cached.db) return cached.db;

  // Otherwise, connect and select the target database
  const client = await getClient();
  cached.db = client.db(DB_NAME);
  return cached.db;
}

/**
 * Get a specific collection by name.
 * Uses generic typing <T> to support type-safe documents.
 *
 * Example usage:
 *   const users = await getCollection<User>('users');
 *   const data = await users.find({}).toArray();
 */
export async function getCollection<T extends Document = Document>(name: string) {
  const db = await getDB();
  return db.collection<T>(name);
}
