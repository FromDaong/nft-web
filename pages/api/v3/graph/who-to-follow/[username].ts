import {getWhomToFollowForProfile} from "@packages/graph";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelProfile} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {username} = req.query;

	if (!username) {
		return res.status(400).json({error: "No username provided"});
	}

	await connectMongoDB();

	const user = await MongoModelProfile.findOne({username});

	const whomToFollow = await getWhomToFollowForProfile(user._id);

	return res.status(200).json(whomToFollow);
}
