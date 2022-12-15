/* eslint-disable no-mixed-spaces-and-tabs */
import {returnWithSuccess} from "@db/engine/utils";
import {ironOptions} from "@utils/index";
import {withIronSessionApiRoute} from "iron-session/next";
import {NextApiRequest, NextApiResponse} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelProfile, MongoModelUser} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await connectMongoDB();

		let user = await MongoModelUser.findOne({
			address: req.session.siwe?.address.toLowerCase(),
		});

		if (!user) {
			user = await MongoModelUser.create({
				address: req.session.siwe?.address.toLowerCase(),
			});
		}

		const profile = await MongoModelProfile.findOne({
			address: req.session.siwe?.address.toLowerCase(),
		});

		req.session.address = req.session.siwe?.address.toLowerCase();
		req.session.profile = profile
			? {
					username: profile.username,
					profile_picture: profile.profile_picture,
					bio: profile.bio,
					displayName: profile.display_name,
					_id: profile._id,
			  }
			: null;
		req.session.user = user.toObject();

		// Add ids of owned nfts

		return returnWithSuccess(req.session, res);
	} catch (err) {
		console.log({err});
		returnWithSuccess(null, res);
	}
};

export default withIronSessionApiRoute(handler, ironOptions);
