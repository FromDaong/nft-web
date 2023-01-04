import {connectMongoDB} from "@db/engine";
import {returnWithError, returnWithSuccess} from "@db/engine/utils";
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
	const {cursor} = req.query;

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
		tokenAddresses: [contractAddresses.treatNFTMinter[56]],
		cursor,
	});

	const ownedNfts = response.toJSON();
	const ownedNftsIds = ownedNfts.result.map((nft) => Number(nft.token_id));

	const options = {
		page: 1,
		limit: response.pagination.pageSize,
	};

	// @ts-ignore
	const nfts = await MongoModelNFT.paginate(
		{
			id: {$in: ownedNftsIds},
		},
		options
	);

	nfts.docs = await MongoModelCreator.populate(nfts.docs, {
		path: "creator",
		select: "username address bio profile",
		populate: {
			path: "profile",
			select: "username profile_pic",
		},
	});

	return returnWithSuccess(
		{
			...nfts,
			cursor: ownedNfts.cursor,
			hasNextPage: response.hasNext(),
			nextPage: response.hasNext() ? response.pagination.page + 1 : null,
		},
		res
	);
}
