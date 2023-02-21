import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelCreator, MongoModelProfile} from "server/helpers/models";
import {protectedAPIRoute} from "server/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();
	const {session} = req;
	const {email, identity_access_key} = req.body;

	if (!email) {
		return returnWithError(
			{
				email: "Please enter a valid email address.",
			},
			401,
			res
		);
	}

	if (!identity_access_key) {
		return returnWithError(
			{
				identity_access_key: "Please enter a valid identity access key.",
			},
			401,
			res
		);
	}
	if (!session) {
		return returnWithError(
			{
				session: "Please login to create a creator profile.",
			},
			401,
			res
		);
	}

	try {
		const profile = await MongoModelProfile.findOne({
			address: session.address.toLowerCase(),
		});

		await MongoModelProfile.findOneAndUpdate(
			{
				profile: profile._id,
			},
			{
				$set: {
					email,
					identity_access_key,
				},
			}
		);

		const creatorProfile = new MongoModelCreator({
			username: profile.username,
			address: profile.address,
			profile: profile._id,
			totm: {
				current: false,
			},
			user: profile.user,
			pending: true,
			approved: false,
			subscription: {
				cost: Number(0.01),
				description: "Temporary description",
			},
			subscriptions_enabled: false,
			identity_access_key,
		});

		await creatorProfile.save();
		return returnWithSuccess(creatorProfile, res);
	} catch (err) {
		console.log({err});
		return returnWithError(
			"An error occurred while creating your profile. Please try again.",
			400,
			res
		);
	}
}

export default protectedAPIRoute(handler);
