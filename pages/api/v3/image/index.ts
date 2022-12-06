import axios from "axios";
const atob = require("atob");
const sharp = require("sharp");

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
	if (req.query.default.includes("mypinata")) {
		try {
			const response = await axios.get(req.query.default, {
				responseType: "arraybuffer",
			});
			const image = await sharp(Buffer.from(response.data))
				.resize(500)
				.toFormat("webp", {nearLossless: true, quality: 50})
				.toBuffer();
			res.setHeader("Content-Type", "image/webp");
			return res.send(image);
		} catch (err) {
			console.log({err});
			const response = await axios.get(req.query.default);

			const blob = dataURLtoFile(response.data); //response.data.replace(`"`, "").replace(/["']/g, "");
			const image = await sharp(blob)
				.resize(500)
				.toFormat("webp", {nearLossless: true, quality: 50})
				.toBuffer();
			res.setHeader("Content-Type", "image/webp");
			return res.send(image);
		}
	} else {
		try {
			const cdnurl = `${req.query.default}-/quality/lighter/-/format/webp/`;
			const image_data = await fetch(cdnurl);
			const img = await image_data.arrayBuffer();
			const finalImage = await sharp(Buffer.from(img))
				.resize(500)
				.toFormat("webp", {nearLossless: true, quality: 50, alphaQuality: 80})
				.toBuffer();
			res.setHeader("Content-Type", "image/webp");
			return res.send(Buffer.from(finalImage));
		} catch (err) {
			const response = await axios.get(req.query.default, {
				responseType: "arraybuffer",
			});

			const blob = response.data;
			const image = await sharp(Buffer.from(blob))
				.resize(500)
				.toFormat("webp", {nearLossless: true, quality: 50, alphaQuality: 80})
				.toBuffer();
			res.setHeader("Content-Type", "image/webp");
			return res.send(image);
		}
	}
}
