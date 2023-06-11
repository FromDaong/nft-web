import {NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {returnWithError, returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelProfile, MongoModelWishlist} from "server/helpers/models";

export default async function handler(req: NextApiRequest, res) {
	await connectMongoDB();

	let {address} = req.query;

	if (!address) return returnWithError("Address is required", 500, res);

	address = address.toString().toLowerCase();

	if (req.method === "GET") {
		const wishlist = await MongoModelWishlist.findOne({
			address,
		})
			.populate({
				path: "nfts",
				populate: "creator",
			})
			.exec();

		return returnWithSuccess(wishlist, res);
	}

	if (req.method === "POST") {
		const {id} = req.body;
		if (!id) return returnWithError("ID is required", 500, res);
		const profile = await MongoModelProfile.findOne({
			address,
		});

		if (!profile) return returnWithError("Profile does not exist", 500, res);

		await MongoModelWishlist.findOneAndUpdate(
			{
				profile: profile._id,
			},
			{
				$addToSet: {
					nfts: id,
				},
				address: address,
			},
			{upsert: true}
		);

		return returnWithSuccess({success: true}, res);
	}

	if (req.method === "PATCH") {
		const {id} = req.body;
		if (!id) return returnWithError("ID is required", 500, res);

		await MongoModelWishlist.findOneAndUpdate(
			{
				address,
			},
			{
				$pull: {
					nfts: id,
				},
			}
		);

		return returnWithSuccess({success: true}, res);
	}

	return returnWithError("METHOD not allowed", 401, res);
}
