import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelProfile} from "server/helpers/models";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {session} = req;

	if (!session.address) {
		return returnWithError("Not logged in", 401, res);
	}

	const {username} = req.query;

	const me = await MongoModelProfile.findOne({
		address: session.address.toLowerCase(),
	});
	const profile = await MongoModelProfile.findOne({
		username,
	});

	if (!profile) {
		return returnWithError("No profile found", 404, res);
	}

	if (me._id.toString() === profile._id.toString()) {
		return returnWithError("You can't follow yourself", 400, res);
	}

	if (me.following.includes(profile._id.toString())) {
		return returnWithError("Already following", 400, res);
	}

	await MongoModelProfile.findOneAndUpdate(
		{
			_id: me._id,
		},
		{
			$push: {
				following: profile._id.toString(),
			},
		}
	);

	await MongoModelProfile.findOneAndUpdate(
		{
			_id: profile._id,
		},
		{
			$push: {
				followers: me._id.toString(),
			},
		}
	);

	return returnWithSuccess("Followed", res);
};

export default protectedAPIRoute(handler);
