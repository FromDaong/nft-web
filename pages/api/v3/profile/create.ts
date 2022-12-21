import {withIronSessionApiRoute} from "iron-session/next";
import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelProfile, MongoModelUser} from "server/helpers/models";
import {ironOptions} from "@utils/index";
import {protectedAPIRoute} from "server/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();
	const {session} = req;

	const {username, displayName, bio} = req.body;

	if (!username || !displayName || !bio)
		return returnWithError(
			{
				username: "Please fill out all fields",
			},
			400,
			res
		);

	try {
		const check_profile = await MongoModelProfile.findOne({username});

		if (check_profile) {
			return returnWithError(
				{
					username: "Username already exists",
				},
				400,
				res
			);
		}

		const user = await MongoModelUser.findOne({
			address: session.address.toLowerCase(),
		});

		const profile = new MongoModelProfile({
			username,
			display_name: displayName,
			bio,
			address: user.address,
			user: user._id,
		});

		await profile.save();
		return returnWithSuccess(profile, res);
	} catch (err) {
		console.log({err});
		return returnWithError(
			{
				bio: "An error occurred while creating your profile. Please try again.",
			},
			400,
			res
		);
	}
}

export default protectedAPIRoute(handler);
