import {returnWithSuccess} from "@db/engine/utils";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {MongoModelCreator, MongoModelNFT} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {address} = req.query;

	const creator = await MongoModelCreator.findOne({
		address: address.toString().toLowerCase(),
	});

	if (!creator) {
		return returnWithSuccess(0, res);
	}

	const collections = await MongoModelNFT.find({
		creator: creator._id,
		subscription_nft: false,
	});

	return returnWithSuccess(collections.length, res);
};

export default handler;
