import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithSuccess} from "server/database/engine/utils";
import {MongoModelProfile} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {username} = req.query;

	if (!username) {
		return res.status(400).json({error: "No username provided"});
	}

	const profile = await MongoModelProfile.findOne({username});

	return returnWithSuccess(profile, res);
}
