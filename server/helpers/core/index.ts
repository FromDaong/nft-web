import mongoose from "mongoose";
import Redis from "ioredis";

let MONGODB_URI = process.env.MONGODB_URI;
let REDIS_URL = process.env.REDIS_URL;

if (!MONGODB_URI)
  MONGODB_URI =
    "mongodb+srv://secureauth:pW3ItSEFBa8wDJ9P@treatcluster.9uuso.mongodb.net/treat?retryWrites=true&w=majority";
if (!REDIS_URL)
  REDIS_URL =
    "redis://default:1d015b8f5aee4a4995140161a1bfc80b@us1-quality-quetzal-39180.upstash.io:39180";

const redisClient = new Redis(REDIS_URL);

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

const connectMongoDB = async (url?: string) => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose
      .connect(url ? url : (MONGODB_URI as string), opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export { connectMongoDB, redisClient };
