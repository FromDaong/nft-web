import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithSuccess} from "server/database/engine/utils";
import {MongoModelProfile, MongoModelTransaction} from "server/helpers/models";

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

	if (profile.followers?.length > 0) {
		return returnWithSuccess(profile.followers, res);
	}

	const tx = await MongoModelTransaction.aggregate([
		{
			$match: {
				"metadata.balanceSender": profile.address,
			},
		},
		{
			$graphLookup: {
				from: "profiles",
				startWith: "$metadata.balanceSender",
				connectFromField: "metadata.balanceSender",
				connectToField: "address",
				as: "followers",
			},
		},
	]);

	const followers = tx.map((tx) => tx.followers[0]);
	const trimmedFollowers = Array.from(new Set(followers));

	await MongoModelProfile.findOneAndUpdate(
		{username},
		{
			$push: {
				followers: trimmedFollowers,
			},
		}
	);

	return returnWithSuccess(
		trimmedFollowers.map((follower) => follower._id),
		res
	);
}
