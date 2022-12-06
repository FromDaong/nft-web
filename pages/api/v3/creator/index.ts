import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {ModelCreator, ModelProfile} from "@db/models/creator";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {data} = req.body;

	if (!data) {
		return returnWithError("No data provided", 400, res);
	}

	await connectMongoDB();

	try {
		const profile = ModelProfile.find({address: data.address});

		if (!profile) {
			return returnWithError("No profile found", 400, res);
		}

		const creatorProfile = await ModelCreator.findOne({
			address: data.address,
		});

		return returnWithSuccess(creatorProfile, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
