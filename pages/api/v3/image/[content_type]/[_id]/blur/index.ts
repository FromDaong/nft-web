import {returnWithError} from "@db/engine/utils";
import axios from "axios";
import {connectMongoDB} from "server/helpers/core";
import BlurhashManager from "server/helpers/core/blurhash";
import {MongoModelNFT} from "server/helpers/models";
import sharp from "sharp";

export default async function image(req, res) {
	const {_id, content_type} = req.query;
	const content_types = ["nft", "creator"];

	if (!content_types.includes(content_type)) {
		return returnWithError("Not found", 404, res);
	}

	await connectMongoDB();

	if (content_type === "nft") {
		const nft = await MongoModelNFT.findById(_id);

		if (!nft.blurhash) {
			const axios_image = await axios.get(
				`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3/media/${nft.image.ipfs}?id=${_id}`,
				{responseType: "arraybuffer"}
			);

			const image = sharp(Buffer.from(axios_image.data));

			const blurhashManager = new BlurhashManager(image);
			await blurhashManager.encodeImage(async (blurhash) => {
				await MongoModelNFT.findByIdAndUpdate(_id, {
					$set: {
						blurhash,
					},
				});

				return res.status(200).send(blurhash);
			});
			return;
		}
		return res.status(200).send(nft.blurhash);
	} else {
		return returnWithError("Not found", 404, res);
	}
}
