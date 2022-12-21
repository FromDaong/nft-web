import {
	populateNFTsWithProfileAndTx,
	returnWithSuccess,
} from "@db/engine/utils";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {
	MongoModelCreator,
	MongoModelNFT,
	MongoModelProfile,
	MongoModelTransaction,
} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// get 4 random nfts from the same collection
	await connectMongoDB();
	const featuredCreator = await MongoModelCreator.aggregate([
		{
			$sample: {size: 20},
		},
		{
			$lookup: {
				from: "profiles",
				localField: "profile",
				foreignField: "_id",
				as: "profile",
			},
		},
		{
			$lookup: {
				from: "marketplacenfts",
				localField: "_id",
				foreignField: "creator",
				as: "nfts",
			},
		},
		{
			$match: {
				"nfts.5": {
					$exists: true,
				},
			},
		},
		{
			$project: {
				nfts: {
					$slice: ["$nfts", 6],
				},
				profile: 1,
				username: 1,
				address: 1,
				_id: 1,
			},
		},
		{
			$limit: 1,
		},
	]);

	return returnWithSuccess(featuredCreator[0], res);
};

export default handler;
