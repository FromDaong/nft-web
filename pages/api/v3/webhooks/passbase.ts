import {NextApiRequest, NextApiResponse} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelCreator, MongoModelProfile} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();
	try {
		if (
			req.body.event === "VERIFICATION_REVIEWED" &&
			req.body.status === "approved"
		) {
			const profile = await MongoModelProfile.findOne({
				identity_access_key: req.body.key,
			}).exec();

			if (!profile)
				return res.status(400).json({success: false, error: "model not found"});

			const creator = new MongoModelCreator({
				username: profile.username,
				address: profile.address,
				profile: profile._id,
				totm: {
					current: false,
				},
				user: profile.user,
			});

			await creator.save();

			res.status(200).json(creator);
		} else {
			res.status(200);
		}
	} catch (error) {
		console.error({error});
		res.status(400).json({success: false, error: error});
	}
}
