import {getSimilarProfiles, getWhomToFollowForProfile} from "@packages/graph";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelProfile} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {username, secondary} = req.query;

	if (!username) {
		return res.status(400).json({error: "No username provided"});
	}

	await connectMongoDB();

	const user = await MongoModelProfile.findOne({username});

	if (!secondary) {
		const whomToFollow = await getWhomToFollowForProfile(user._id);

		return res.status(200).json(whomToFollow);
	}

	const secondaryUser = await MongoModelProfile.findOne({username}).lean();
	const excluded = secondaryUser.following
		.concat(secondaryUser._id)
		.concat(user.following)
		.map((id) => id.toString());

	const similarProfiles = await getSimilarProfiles(user._id, excluded);

	return res.status(200).json(similarProfiles);
}
