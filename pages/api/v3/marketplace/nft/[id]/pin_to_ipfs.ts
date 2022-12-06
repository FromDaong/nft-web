import {connectMongoDB} from "@db/engine";
import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import LegacyNFTModel from "@db/legacy/nft/NFT";

export default async function handler(req, res) {
	await connectMongoDB();
	const {id} = req.query;

	if (!id) {
		return returnWithError("No ID provided", 400, res);
	}

	try {
		const nft = await LegacyNFTModel.findOne({id});

		const result = await fetch(`https://api.pinata.cloud/pinning/pinByHash`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				pinata_api_key: "b949556813c4f284c550",
				pinata_secret_api_key:
					"7a7b755c9c067dedb142c2cb9e9c077aebf561b552c440bf67b87331bac32939",
			},
			body: JSON.stringify({
				hashToPin: nft.image.replace(
					"https://treatdao.mypinata.cloud/ipfs/",
					""
				),
			}),
		});

		const resJSON = await result.json();
		return returnWithSuccess(resJSON, res);
	} catch (err) {
		return returnWithError(err, 400, res);
	}
}
