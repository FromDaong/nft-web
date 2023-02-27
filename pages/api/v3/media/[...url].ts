import axios from "axios";
import {decode} from "blurhash";
import {connectMongoDB} from "server/helpers/core";
import {uploadFileToIPFS} from "server/helpers/core/pinata";
import {MongoModelNFT} from "server/helpers/models";
import sharp from "sharp";
const atob = require("atob");
const {encode} = require("blurhash");

export const encodeImage = async (sharpObj, res, id) => {
	try {
		const obj = await sharpObj
			.raw()
			.ensureAlpha()
			.resize(32, 32, {fit: "inside"});

		await obj.toBuffer(async (err, buffer, info) => {
			let encoded;
			if (err) {
				await connectMongoDB();
				const nft = await MongoModelNFT.findOne({id});
				encoded = nft.blurhash;
			} else {
				encoded = await encode(
					new Uint8ClampedArray(buffer),
					info.width,
					info.height,
					4,
					4
				);
			}

			const hashWidth = 400;
			const hashHeight = Math.round(hashWidth * (400 / 400));

			const pixels = decode(encoded, hashWidth, hashHeight);

			const resizedImageBuf = await sharp(Buffer.from(pixels), {
				raw: {
					channels: 4,
					width: hashWidth,
					height: hashHeight,
				},
			})
				.toFormat("webp", {
					nearLossless: true,
					alphaQuality: 100,
				})
				.toBuffer();

			res.setHeader("Content-Type", "image/webp");
			return res.send(resizedImageBuf);
		});
	} catch (encodingError) {
		console.log({encodingError});
		return res.json({error: true});
	}
};

function dataURLtoFile(dataurl) {
	const arr = dataurl.split(",");
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return Buffer.from(u8arr);
}

// Checks if image does not return error from CDN
// If it does it then downloads and sends the base64 encoded image from pinata
export default async function fetchWithFallback(req, res) {
	const {url, blurhash, id, _id} = req.query;

	if (!url || url === "undefined") {
		res.status(404).send("Not Found");
		return;
	}

	const defaultUrl =
		"https://" + (url as Array<string>).slice(1).join("/") + "?q=20";

	try {
		const response = await axios.get(defaultUrl, {
			responseType: "arraybuffer",
		});
		const image = await sharp(Buffer.from(response.data));
		const metadata = await image.metadata();

		if (blurhash) {
			return await encodeImage(image, res, id);
		}

		res.setHeader("Content-Type", `image/${metadata.format}`);
		return res.send(await image.toBuffer());
	} catch (err) {
		console.log({err});
		const response = await axios.get(defaultUrl);

		const blob = dataURLtoFile(response.data); //response.data.replace(`"`, "").replace(/["']/g, "");
		const image = await sharp(blob);
		const metadata = await image.metadata();

		const bufferImage = await image.toFormat("png").toBuffer();
		const ipfsUrl = await uploadFileToIPFS(bufferImage);
		await MongoModelNFT.findById(_id, {
			$set: {
				image: {
					ipfs: ipfsUrl,
				},
			},
		});

		if (blurhash) {
			return encodeImage(image, res, id);
		}

		res.setHeader("Content-Type", `image/${metadata.format}`);
		return res.send(await image.toBuffer());
	}
}
