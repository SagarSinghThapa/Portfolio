import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // Graceful fallback when MONGODB_URI is not configured yet
  clientPromise = null;
}

/**
 * Helper to get MongoDB database instance if configured
 * @param dbName Optional database name (defaults to connection URI default db or 'portfolio')
 */
export async function getDatabase(dbName: string = "portfolio"): Promise<Db | null> {
  if (!clientPromise) {
    return null;
  }
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas:", error);
    return null;
  }
}

export default clientPromise;
