// return nft by [id]

import {connectMongoDB} from "server/helpers/core";
import {MongoModelNFT} from "server/helpers/models";

export default async function handler(req, res) {
	await connectMongoDB();

	let {id} = req.query;

	if (!id) {
		return res.status(400).json({
			error: true,
			message: "Missing id",
		});
	}

	id = parseInt(id);

	const nft = await MongoModelNFT.findOne({id: parseInt(id)})
		.populate({
			path: "creator",
			select: "username profile address",
			populate: {
				path: "profile",
				select: "username profile_pic display_name",
			},
		})
		.exec();

	return res.status(200).json(nft);
}
