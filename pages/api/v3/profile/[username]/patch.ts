import {MongoModelProfile} from "server/database/models/creator";
import {MongoModelCreator} from "./../../../../../server/database/models/creator/index";
import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {username} = req.query;
	const {data} = req.body;

	if (!username) {
		return returnWithError("No username provided", 400, res);
	}

	await connectMongoDB();

	try {
		// Edit fields of nft and set data to them and save
		// Do not update price

		if (data.username) {
			delete data.username;
		}

		const profile = await MongoModelProfile.findOneAndUpdate(
			{username},
			{...data},
			{new: true}
		);

		return returnWithSuccess(profile, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
