import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Node.js querySrv ECONNREFUSED when resolving MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // Ignore if not supported in runtime
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env.local file.");
}

/**
 * Global cache to reuse the Mongoose connection across hot-reloads in dev.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => {
        cached.conn = m;
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }
}
