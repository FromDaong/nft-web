import Moralis from "moralis";

let cached = global.moralis;

if (!cached) {
	cached = global.moralis = {conn: null, promise: null};
}

const connectMoralis = async () => {
	if (cached.conn || Moralis.Core.isStarted) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = Moralis.start({
			apiKey: process.env.MORALIS_WEB3_API_KEY,
		}).then((moralis) => {
			return moralis;
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
};

export default connectMoralis;
