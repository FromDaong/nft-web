import {MongoModelCreator, MongoSubscriptionModel} from "@db/models/creator";
import {
	connectMongoDB,
	getFromRedisCache,
	redisClient,
	setStringToRedisCache,
} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {returnWithSuccess} from "server/database/engine/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {username} = req.query;

	if (!username) {
		return res.status(400).json({error: "No username provided"});
	}

	let creatorIds = await getFromRedisCache(`subscription_packages:creatorIds`);

	if (!creatorIds) {
		const subscriptions = await MongoSubscriptionModel.find();
		creatorIds = subscriptions.map((subscription) => subscription.creatorId);
		await setStringToRedisCache(`subscription_packages:creatorIds`, creatorIds);
	}

	const creator = await MongoModelCreator.find({id: {$in: creatorIds}});

	if (!creator) {
		return res.status(404).json({error: "Creator not found"});
	}

	return returnWithSuccess(creator, res);
}
