import axios from "axios";
import sharp from "sharp";
const atob = require("atob");

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

export default class SharpManager {
	static async getCompressedImage(url: string, size = 360) {
		try {
			const response = await axios.get(url, {
				responseType: "arraybuffer",
			});
			const image = await sharp(Buffer.from(response.data));

			const metadata = await image.metadata();
			if (metadata.format === "gif") {
				return image.gif();
			}
			return image.resize(size);
		} catch (err) {
			const response = await axios.get(url);

			const blob = dataURLtoFile(
				response.data.replace(`"`, "").replace(/["']/g, "")
			);
			const image = await sharp(blob);

			const metadata = await image.metadata();
			if (metadata.format === "gif") {
				return image;
			}

			return image.resize(size);
		}
	}
}
