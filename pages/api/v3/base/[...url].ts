import axios from "axios";
const sharp = require("sharp");
const {encode} = require("blurhash");

export const encodeImage = async (sharpObj, res) => {
	try {
		const obj = await sharpObj
			.raw()
			.ensureAlpha()
			.resize(32, 32, {fit: "inside"});

		await obj.toBuffer(async (err, buffer, info) => {
			console.log({err, buffer, info});
			if (err) throw Error(err);

			const encoded = await encode(
				new Uint8ClampedArray(buffer),
				info.width,
				info.height,
				4,
				4
			);
			return res.send(encoded);
		});
	} catch (encodingError) {
		console.log({encodingError});
		return res.json({error: true});
	}
};

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
	const response = await axios.get(defaultUrl, {responseType: "arraybuffer"});

	try {
		const image = await sharp(Buffer.from(response.data), {});
		if (blurhash) {
			return encodeImage(image, res);
		}

		res.setHeader("Content-Type", "image/webp");
		return res.send(await image.toBuffer());
	} catch (error) {
		console.log({error});
		const response = await axios.post(
			"/api/v3/media-2/fallback",
			{
				url: defaultUrl,
				blur: true,
			},
			{responseType: "arraybuffer"}
		);

		const image = await sharp(Buffer.from(response.data));
		if (blurhash) {
			return encodeImage(image, res);
		}
		return res.send(await image.toBuffer());
	}
}
