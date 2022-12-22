import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {
	MongoModelCollection,
	MongoModelCreator,
	MongoModelNFT,
	MongoModelProfile,
} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {username} = req.query;
	const {page} = req.query;
	const get_page = Number(page ?? 1) || 1;
	const options = {
		page: get_page,
		limit: 8,
	};

	if (!username) {
		return returnWithError("No username provided", 401, res);
	}

	const profile = await MongoModelProfile.findOne({username}).exec();

	if (!profile) {
		return returnWithError("No profile found", 404, res);
	}

	const creator = await MongoModelCreator.findOne({
		profile: profile._id,
	}).exec();

	if (!creator) {
		creator._id = profile._id;
	}

	// @ts-ignore
	const collections = await MongoModelCollection.paginate(
		{
			$or: [
				{
					creator: creator._id.toString(),
				},
				{
					profile: profile._id.toString(),
				},
			],
		},
		options
	);

	return returnWithSuccess(collections, res);
}
