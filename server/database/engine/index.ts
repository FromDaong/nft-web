import mongoose from "mongoose";
import Redis from "ioredis";

const MONGODB_URI = process.env.MONGODB_URI;
const REDIS_URL = process.env.REDIS_URL;

let cached = global.mongoose;

const redisClient = new Redis(REDIS_URL);

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local"
	);
}

if (!cached) {
	cached = global.mongoose = {conn: null, promise: null};
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
			.connect(url ? url : MONGODB_URI, {...opts})
			.then((mongoose) => {
				return mongoose;
			});
	}
	cached.conn = await cached.promise;
	return cached.conn;
};

export {connectMongoDB, redisClient};
