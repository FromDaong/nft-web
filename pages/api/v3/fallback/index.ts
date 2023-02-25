import axios from "axios";
const atob = require("atob");
const sharp = require("sharp");
const {encode} = require("blurhash");

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
	const {url} = req.body;

	console.log({url});

	if (!url || url === "undefined") {
		res.status(404).send("Not Found");
		return;
	}

	const response = await axios.get(url);

	const extension = response.data.includes("gif") ? "gif" : "png";
	const blob = dataURLtoFile(response.data);
	const image = await sharp(blob);

	res.setHeader("Content-Type", `image/${extension}`);
	return res.send(await image.toFormat(extension).toBuffer());
}
