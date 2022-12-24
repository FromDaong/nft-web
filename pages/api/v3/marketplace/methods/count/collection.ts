import {returnWithSuccess} from "@db/engine/utils";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {MongoModelCollection, MongoModelProfile} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {address} = req.query;

	const profile = await MongoModelProfile.findOne({
		address: address.toString().toLowerCase(),
	});

	const collections = await MongoModelCollection.find({
		profile: profile._id,
	});

	return returnWithSuccess(collections.length, res);
};

export default handler;
