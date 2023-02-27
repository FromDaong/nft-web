import {decode, encode} from "blurhash";
import sharp from "sharp";

export default class BlurhashManager {
	blurhash: string;
	image: sharp.Sharp;

	constructor(image: sharp.Sharp) {
		this.image = image;
	}

	async encodeImage(callback: (blurhash: string) => void) {
		const obj = await this.image
			.raw()
			.ensureAlpha()
			.resize(32, 32, {fit: "inside"});
		const encoded = await obj.toBuffer(async (err, buffer, info) => {
			const encoded = await encode(
				new Uint8ClampedArray(buffer),
				info.width,
				info.height,
				4,
				4
			);

			callback(encoded);
			return;
		});

		return encoded;
	}

	static async decode(encoded: string) {
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

		return resizedImageBuf;
	}
}
