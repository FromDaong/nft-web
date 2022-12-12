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
import {
	MongoModelCreator,
	MongoModelNFT,
	MongoModelProfile,
} from "server/helpers/models";

export default async function handler(req, res) {
	const {username} = req.query;

	if (!username) {
		return returnWithError("No username provided", 400, res);
	}

	await connectMoralis();
	await connectMongoDB();

	const profile = await MongoModelProfile.findOne({username});

	if (!profile) {
		return returnWithError("No profile found", 400, res);
	}

	const response = await Moralis.EvmApi.nft.getWalletNFTs({
		address: profile.address,
		chain: EvmChain.BSC,
		tokenAddresses: [
			contractAddresses.treatNFTMinter[56],
			contractAddresses.treatNFTMinterV1[56],
		],
	});

	const ownedNfts = response.toJSON();
	const ownedNftsIds = ownedNfts.result.map((nft) => Number(nft.token_id));

	const nfts = await MongoModelNFT.find({
		id: {$in: ownedNftsIds},
	}).populate({
		path: "creator",
		select: "username address bio profile",
		model: MongoModelCreator,
	});

	const nftsWithProfile = await populateNFTsWithProfileAndTx(nfts);

	return returnWithSuccess(nftsWithProfile.flat(), res);
}
