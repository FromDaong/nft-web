import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {
	enforcePrivacyForNFTs,
	returnWithSuccess,
} from "server/database/engine/utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const NFTs = await LegacyNFTModel.find();

	return returnWithSuccess(enforcePrivacyForNFTs(NFTs), res);
}
