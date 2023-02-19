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
import axios from "axios";

export default async function handler(req, res) {
	const {username} = req.query;
	const {p} = req.query;

	if (!username) {
		return returnWithError("No username provided", 400, res);
	}

	await connectMoralis();
	await connectMongoDB();

	const profile = await MongoModelProfile.findOne({username});

	if (!profile) {
		return returnWithError("No profile found", 400, res);
	}

	let moralis_cursor;
	let response;

	for (let i = 0; i < Number(p); i++) {
		const resp = await axios.get(
			`https://deep-index.moralis.io/api/v2/${
				profile.address
			}/nft?chain=bsc&disable_total=false&limit=24&format=decimal${
				moralis_cursor ? "&cursor=" + moralis_cursor : ""
			}&token_address=${[contractAddresses.treatNFTMinter[56]]}`,
			{
				headers: {
					"X-API-Key": process.env.MORALIS_WEB3_API_KEY,
				},
			}
		);

		moralis_cursor = resp.data.cursor;
		response = resp.data;
	}

	const data = response;

	const ownedNftsIds = data.result.map((nft) => Number(nft.token_id));

	const options = {
		page: 1,
		limit: 24,
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
			cursor: data.cursor,
			hasNextPage: data.page * 24 < data.total,
			nextPage: data.page * 24 < data.total ? data.page + 1 : null,
			page: Number(p),
			total: data.total,
		},
		res
	);
}
