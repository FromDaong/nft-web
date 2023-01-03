import axios from "axios";
import {decode} from "blurhash";
const atob = require("atob");
const sharp = require("sharp");
const {encode} = require("blurhash");

const encodeImage = async (sharpObj, res) => {
	try {
		const obj = await sharpObj
			.raw()
			.ensureAlpha()
			.resize(32, 32, {fit: "inside"});

		await obj.toBuffer(async (err, buffer, info) => {
			if (err) return res.send("null");

			const encoded = await encode(
				new Uint8ClampedArray(buffer),
				info.width,
				info.height,
				4,
				4
			);

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
	} catch (err) {
		console.log(err);
		return res.send(null);
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
	const {url, blurhash} = req.query;

	if (!url || url === "undefined") {
		res.status(404).send("Not Found");
		return;
	}

	const defaultUrl =
		"https://" + (url as Array<string>).slice(1).join("/") + "?q=20";
	console.log({defaultUrl});

	if (defaultUrl.includes("treatdaoipfs")) {
		try {
			const response = await axios.get(defaultUrl, {
				responseType: "arraybuffer",
			});
			const image = await sharp(Buffer.from(response.data));

			if (blurhash) {
				return await encodeImage(image, res);
			}

			res.setHeader("Content-Type", "image/webp");
			return res.send(
				await image
					.toFormat("webp", {
						nearLossless: true,
						alphaQuality: 100,
					})
					.toBuffer()
			);
		} catch (err) {
			console.log({err});
			const response = await axios.get(defaultUrl);

			const blob = dataURLtoFile(response.data); //response.data.replace(`"`, "").replace(/["']/g, "");
			const image = await sharp(blob);

			if (blurhash) {
				return encodeImage(image, res);
			}

			res.setHeader("Content-Type", "image/webp");
			return res.send(
				await image
					.toFormat("webp", {
						nearLossless: true,
						alphaQuality: 100,
					})
					.toBuffer()
			);
		}
	} else {
		try {
			const cdnurl = `${defaultUrl}-/quality/lighter/-/format/webp/`;
			const image_data = await fetch(cdnurl);
			const img = await image_data.arrayBuffer();
			const image = await sharp(Buffer.from(img));

			if (blurhash) {
				return encodeImage(image, res);
			}

			res.setHeader("Content-Type", "image/webp");
			return res.send(
				await image
					.toFormat("webp", {
						nearLossless: true,
						alphaQuality: 100,
					})
					.toBuffer()
			);
		} catch (err) {
			const response = await axios.get(defaultUrl, {
				responseType: "arraybuffer",
			});

			const blob = response.data;
			const image = await sharp(Buffer.from(blob));

			if (blurhash) {
				return encodeImage(image, res);
			}

			res.setHeader("Content-Type", "image/webp");
			return res.send(
				await image
					.toFormat("webp", {
						nearLossless: true,
						alphaQuality: 100,
					})
					.toBuffer()
			);
		}
	}
}
