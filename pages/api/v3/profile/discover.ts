import {
	populateNFTsWithProfileAndTx,
	returnWithSuccess,
} from "@db/engine/utils";
import {ironOptions} from "@utils/index";
import {withIronSessionApiRoute} from "iron-session/next";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelCreator} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	// get 4 random nfts from the same collection
	await connectMongoDB();
	const creators = await MongoModelCreator.aggregate([
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
				"nfts.1": {
					$exists: true,
				},
			},
		},
		{
			// remove nfts from the creator object
			$project: {
				nfts: 0,
			},
		},
		{
			$limit: 4,
		},
	]);

	return returnWithSuccess(creators, res);
};

export default withIronSessionApiRoute(handler, ironOptions);
