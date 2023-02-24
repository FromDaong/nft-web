import {returnWithSuccess} from "@db/engine/utils";
import {ironOptions} from "@utils/index";
import {withIronSessionApiRoute} from "iron-session/next";
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
	const nfts = await MongoModelNFT.aggregate([
		{
			$match: {
				melon_nft: false,
				subscription_nft: false,
			},
		},
		{
			$sample: {size: 4},
		},
	]);

	const populated_nfts = await Promise.all(
		nfts
			.map(async (nft) => {
				const creator_id = nft.creator;
				const creator = await MongoModelCreator.findById(creator_id);
				const profile = await MongoModelProfile.findById(creator.profile);
				const mints = await MongoModelTransaction.find({
					"metadata.nftId": nft.id,
				});

				const returnObj = {
					...nft,
					creator: {
						...creator.toObject(),
						profile_pic: profile.profile_pic,
					},
					mints,
				};

				return returnObj;
			})
			.filter((nft) => nft !== null)
	);

	return returnWithSuccess(populated_nfts, res);
};

export default withIronSessionApiRoute(handler, ironOptions);
