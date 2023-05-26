// return nft by [id]

import {connectMongoDB} from "server/helpers/core";
import {returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelNFT} from "server/helpers/models";

export default async function handler(req, res) {
	await connectMongoDB();

	const {id} = req.query;

	if (!id) {
		return res.status(400).json({
			error: true,
			message: "Missing id",
		});
	}

	const nft = await MongoModelNFT.findOne({id})
		.populate({
			path: "creator",
			select: "username profile address",
			populate: {
				path: "profile",
				select: "username profile_pic display_name",
			},
		})
		.exec();

	return returnWithSuccess(nft, res);
}
