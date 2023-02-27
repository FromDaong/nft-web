// downsize and save, otherwise fetch again
import {returnWithError} from "@db/engine/utils";
import {NextApiResponse} from "next";
import {connectMongoDB} from "server/helpers/core";
import {uploadFileToIPFS} from "server/helpers/core/pinata";
import SharpManager from "server/helpers/core/sharp";
import {MongoModelNFT} from "server/helpers/models";

export default async function image(req, res: NextApiResponse) {
	const {_id, content_type} = req.query;
	const content_types = ["nft", "creator"];

	if (!content_types.includes(content_type)) {
		return returnWithError("Not found", 404, res);
	}

	await connectMongoDB();

	if (content_type === "nft") {
		const nft = await MongoModelNFT.findById(_id);

		if (!nft.sd_image) {
			const compressed_image = await SharpManager.getCompressedImage(
				nft.image.ipfs,
				480
			);

			const ipfsUrl = await uploadFileToIPFS(compressed_image);

			await MongoModelNFT.findById(_id, {
				$set: {
					sd_image: ipfsUrl,
				},
			});
		}

		return res.redirect(301, nft.sd_image);
	}

	return res.status(400).send("not found");
}
