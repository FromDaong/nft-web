import {withIronSessionApiRoute} from "iron-session/next";
import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelCreator, MongoModelProfile} from "server/helpers/models";
import {ironOptions} from "@utils/index";
import {protectedAPIRoute} from "server/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();
	const {session} = req;

	try {
		const profile = await MongoModelProfile.findOne({
			address: session.address.toLowerCase(),
		});

		const creatorProfile = new MongoModelCreator({
			username: profile.username,
			address: profile.address,
			profile: profile._id,
			totm: {
				current: false,
			},
			user: profile.user,
		});

		await creatorProfile.save();
		return returnWithSuccess(creatorProfile, res);
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
