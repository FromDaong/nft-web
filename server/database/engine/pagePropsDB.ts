import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local"
	);
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = {conn: null, promise: null};
}

const pagePropsConnectMongoDB = async (url?: string) => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: true,
		};

		cached.promise = mongoose
			.connect(url ? url : MONGODB_URI, opts)
			.then((mongoose) => {
				return mongoose;
			});
	}
	cached.conn = await cached.promise;
	return cached.conn;
};

export {pagePropsConnectMongoDB};
