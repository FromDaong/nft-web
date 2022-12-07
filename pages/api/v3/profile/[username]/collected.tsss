import {
	connectMongoDB,
	getFromRedisCache,
	setStringToRedisCache,
} from "@db/engine";
import TreatNFTMinterABI from "packages/treat/lib/abi/treatnftminter.json";
import MoralisInstance, {ethers, web3Node} from "core/chain/moralis";
import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {MongoModelProfile} from "@db/models/creator";

export default async function handler(req, res) {
	const {username} = req.query;
	let {page} = req.query;

	if (!username) {
		return returnWithError("No username provided", 400, res);
	}

	await connectMongoDB();

	const profile = await MongoModelProfile.findOne({username});

	if (!profile) {
		return returnWithError("No profile found", 404, res);
	}

	const nftsOnPage = getFromRedisCache(`${username}:owned_nfts:${page}`);

	if (nftsOnPage) {
		return returnWithSuccess(nftsOnPage, res);
	}

	page = parseInt(page);

	let cursor;
	let owned_nfts: any = {};
	let n = 0;

	while (cursor !== null && n < parseInt(page)) {
		const nfts: any = await MoralisInstance.Web3API.account.getNFTsForContract({
			address: profile.address,
			token_address: process.env.TREAT_MINTER_ADDRESS,
			chain: "bsc",
			limit: 12,
			cursor,
		});
		owned_nfts = nfts;
		n++;

		if (nfts.next) {
			cursor = nfts.cursor;
		} else {
			cursor = null;
		}
	}

	const treatNFTMinter = new ethers.Contract(
		process.env.TREAT_MINTER_ADDRESS,
		TreatNFTMinterABI,
		web3Node
	);

	const nftids = owned_nfts.result.map((nft) => Number(nft.token_id));
	// @ts-ignore
	let ownedTokensWithMetadata = await NFT.find({
		id: {$in: nftids},
	});

	ownedTokensWithMetadata = await Promise.all(
		ownedTokensWithMetadata.map(async (data) => {
			const nft_data = owned_nfts.result.find(
				(owned_nft) => Number(owned_nft.token_id) === data.id
			);
			if (nft_data) {
				const returnObj = {
					...nft_data,
					...data.toObject(),
				};

				const balance = await treatNFTMinter.balanceOf(
					profile.address,
					returnObj.id
				);

				returnObj.balance = Number(balance.toString());

				if (returnObj.cdnUrl) {
					returnObj.image = returnObj.cdnUrl;
					delete returnObj.cdnUrl;
				}

				delete returnObj.description;
				delete returnObj.mints;

				return returnObj;
			}
			return undefined;
		})
	);

	ownedTokensWithMetadata = ownedTokensWithMetadata.filter((e) => e);

	page = n;

	const returnObj = {
		docs: ownedTokensWithMetadata,
		page,
		totalPages: Math.ceil(owned_nfts.total / 12),
		nextPage: page + 1,
		hasNextPage: page < Math.ceil(owned_nfts.total / 12),
		hasPrevPage: page - 1 > 0,
		limit: 12,
		totalDocs: owned_nfts.total,
		prevPage: page === 1 ? null : page - 1,
	};

	await setStringToRedisCache(`${username}:owned_nfts:${page}`, returnObj);

	return returnWithSuccess(returnObj, 200);
}
