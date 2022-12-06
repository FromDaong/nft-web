import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {id} = req.query;
	if (!id) {
		return returnWithError("No ID provided", 400, res);
	}

	await connectMongoDB();

	const NFTs = await LegacyNFTModel.findOne({id});

	return returnWithSuccess(NFTs, res);
}
