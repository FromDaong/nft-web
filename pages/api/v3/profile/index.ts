import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {MongoModelProfile} from "server/database/models/creator";
import {NextApiRequest, NextApiResponse} from "next";
import LegacyCreatorModel from "server/database/legacy/profile/Creator";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	try {
		const creators = /*MongoModelProfile*/ LegacyCreatorModel.find();
		return returnWithSuccess(creators, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
