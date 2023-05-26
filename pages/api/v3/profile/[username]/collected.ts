import {connectMongoDB} from "@db/engine";
import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import connectMoralis from "@utils/moralis";
import {
	MongoModelCreator,
	MongoModelNFT,
	MongoModelProfile,
} from "server/helpers/models";
import axios from "axios";
import {
	MoralisNFTApiURLBuilder,
	generateNewNFTFromOwnedButLostNFT,
} from "@lib/moralis";

export default async function handler(req, res) {
	const {username} = req.query;
	let {p} = req.query;

	if (!p) {
		p = 1;
	}

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
			}/nft?chain=bsc&disable_total=false&limit=100&format=decimal${
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
	const nftsFromMoralis = data.result.map((nft) => nft);

	const options = {
		page: 1,
		limit: 100,
	};

	/*
	// @ts-ignore
	const nfts = await MongoModelNFT.paginate(
		{
			id: {$in: ownedNftsIds},
		},
		options
	);
	*/

	// nfts = []
	// loop through ownedNftsIds and find in Mongo and push to arr
	// if not found, create new NFT and push to arr
	let nfts = nftsFromMoralis.map(async (nftFromMoralis) => {
		const nft = await MongoModelNFT.findOne({id: nftFromMoralis.token_id});

		if (nft) {
			return nft;
		}

		const newNFT = generateNewNFTFromOwnedButLostNFT(nftFromMoralis);

		return newNFT;
	});

	nfts = nfts.filter((nft) => nft);
	nfts = await MongoModelCreator.populate(nfts.docs, {
		path: "creator",
		select: "username address bio profile",
		populate: {
			path: "profile",
			select: "username profile_pic",
		},
	});

	return returnWithSuccess(
		{
			docs: nfts,
			cursor: data.cursor,
			hasNextPage: data.page * 100 < data.total,
			nextPage: data.page * 100 < data.total ? data.page + 1 : null,
			page: Number(p),
			total: data.total,
			totalPages: Math.ceil(Number(data.total) / 100),
		},
		res
	);
}
