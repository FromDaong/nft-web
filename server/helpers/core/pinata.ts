import {Readable} from "stream";

import pinataSDK from "@pinata/sdk";
const pinata = new pinataSDK(
	process.env.PINATA_API_KEY,
	process.env.PINATA_SECRET_KEY
);

export const getPinataUrl = (IpfsHash: string) =>
	`https://treatdao.mypinata.cloud/ipfs/${IpfsHash}`;

export async function uploadFileToIPFS(compressed_image, filename) {
	const stream = Readable.from(compressed_image.toBuffer());

	const pinataResponse = await pinata.pinFileToIPFS(stream, {
		pinataMetadata: {
			name: filename,
		},
		pinataOptions: {
			cidVersion: 0,
		},
	});

	const {IpfsHash} = pinataResponse;
	const ipfsUrl = getPinataUrl(IpfsHash);
	return ipfsUrl;
}

export default pinata;
