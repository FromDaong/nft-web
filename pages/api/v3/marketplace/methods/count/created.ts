import {returnWithSuccess} from "@db/engine/utils";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {MongoModelCreator, MongoModelNFT} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {address} = req.query;

	const creator = await MongoModelCreator.findOne({
		address: address.toString().toLowerCase(),
	});

	const collections = await MongoModelNFT.find({
		creator: creator._id,
		$or: [
			{
				subscription_nft: false,
			},
			{
				subscription_nft: {
					$exists: false,
				},
			},
		],
	});

	return returnWithSuccess(collections.length, res);
};

export default handler;
