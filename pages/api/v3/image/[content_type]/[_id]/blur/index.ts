import {returnWithError} from "@db/engine/utils";
import axios from "axios";
import {decode} from "blurhash";
import {NextApiResponse} from "next";
import {connectMongoDB} from "server/helpers/core";
import BlurhashManager from "server/helpers/core/blurhash";
import {uploadFileToIPFS} from "server/helpers/core/pinata";
import {MongoModelNFT} from "server/helpers/models";
import sharp from "sharp";

const renderImage = async (encoded: string): Promise<sharp.Sharp> => {
	const hashWidth = 400;
	const hashHeight = Math.round(hashWidth * (400 / 400));

	const pixels = decode(encoded, hashWidth, hashHeight);

	const resizedImageBuf = await sharp(Buffer.from(pixels), {
		raw: {
			channels: 4,
			width: hashWidth,
			height: hashHeight,
		},
	}).toFormat("png", {
		nearLossless: true,
		alphaQuality: 70,
	});

	return resizedImageBuf;
};

export default async function image(req, res) {
	const {_id, content_type} = req.query;
	const content_types = ["nft", "creator"];

	if (!content_types.includes(content_type)) {
		return returnWithError("Not found", 404, res);
	}

	await connectMongoDB();

	if (content_type === "nft") {
		const nft = await MongoModelNFT.findById(_id);

		if (!nft.blurred_image) {
			const axios_image = await axios.get(
				`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3/media/${nft.image.ipfs}?id=${_id}`,
				{responseType: "arraybuffer"}
			);

			const image = sharp(Buffer.from(axios_image.data));

			const blurhashManager = new BlurhashManager(image);
			await blurhashManager.encodeImage(async (blurhash) => {
				const blurredImage = await renderImage(blurhash);

				const blurredImageUrl = await uploadFileToIPFS(
					blurredImage,
					`nft-blurred-${_id}.png`
				);

				await MongoModelNFT.findByIdAndUpdate(_id, {
					$set: {
						blurhash,
						blurredImageUrl,
					},
				});

				return res.redirect(blurredImageUrl);
			});
			return;
		}

		return res.redirect(nft.blurred_image);
	} else {
		return returnWithError("Not found", 404, res);
	}
}
