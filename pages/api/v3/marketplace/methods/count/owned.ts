import {connectMongoDB} from "@db/engine";
import {
	populateNFTsWithProfileAndTx,
	returnWithError,
	returnWithSuccess,
} from "@db/engine/utils";
import Moralis from "moralis";
import {EvmChain} from "@moralisweb3/common-evm-utils";
import {contractAddresses} from "@packages/treat/lib/constants";
import connectMoralis from "@utils/moralis";
import {MongoModelProfile} from "server/helpers/models";

export default async function handler(req, res) {
	const {address} = req.query;

	if (!address) {
		return returnWithError("No username provided", 400, res);
	}

	await connectMoralis();
	await connectMongoDB();

	const profile = await MongoModelProfile.findOne({
		address: address.toString().toLowerCase(),
	});

	if (!profile) {
		return returnWithError("No profile found", 400, res);
	}

	const response = await Moralis.EvmApi.nft.getWalletNFTs({
		address: profile.address,
		chain: EvmChain.BSC,
		tokenAddresses: [contractAddresses.treatNFTMinter[56]],
		normalizeMetadata: true,
	});

	console.log(response.toJSON().result.map((nft) => Number(nft.token_id)));

	return returnWithSuccess(response.pagination.total, res);
}
