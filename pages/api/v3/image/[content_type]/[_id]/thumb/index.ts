// Return the blurhash of the image
import {returnWithError} from "@db/engine/utils";
import {connectMongoDB} from "server/helpers/core";
import pinata, {
	getPinataUrl,
	uploadFileToIPFS,
} from "server/helpers/core/pinata";
import SharpManager from "server/helpers/core/sharp";
import {MongoModelCreator, MongoModelNFT} from "server/helpers/models";

export default async function image(req, res) {
	const {_id, content_type} = req.query;
	const content_types = ["nft", "creator"];

	if (!content_types.includes(content_type)) {
		return returnWithError("Not found", 404, res);
	}

	await connectMongoDB();

	if (content_type === "nft") {
		const nft = await MongoModelNFT.findById(_id);

		if (!nft.thumbnail) {
			const compressed_image = await SharpManager.getCompressedImage(
				nft.image.ipfs
			);

			const ipfsUrl = await uploadFileToIPFS(compressed_image);

			await MongoModelNFT.findById(_id, {
				$set: {thumbnail: ipfsUrl},
			});

			return res.redirect(301, ipfsUrl);
		}

		return res.redirect(301, nft.image.thumbnail);
	}

	if (content_type === "creator") {
		const creator = await MongoModelCreator.findById(_id)
			.populate("profile")
			.exec();

		if (!creator.profile.profile_pic) {
			return res.redirect(
				301,
				"https://treatdao.mypinata.cloud/ipfs/QmdRewQfGbQP95hcyabRwRnXKWFH8Lyrr8ak6xc2y4uWTP"
			);
		}
		if (!creator.profile_pic) {
			const compressed_image = await SharpManager.getCompressedImage(
				creator.profile.profile_pic
			);

			const ipfsUrl = await uploadFileToIPFS(compressed_image);

			await MongoModelCreator.findByIdAndUpdate(_id, {
				set: {
					profile_pic: ipfsUrl,
				},
			});

			return res.redirect(301, ipfsUrl);
		}

		return res.redirect(301, creator.profile_pic);
	}
}
