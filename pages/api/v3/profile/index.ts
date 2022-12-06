import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {ModelProfile} from "@db/models/creator";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	try {
		const creators = ModelProfile.find();
		return returnWithSuccess(creators, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
