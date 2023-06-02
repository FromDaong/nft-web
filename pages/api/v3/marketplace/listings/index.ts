import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {ethers} from "ethers";
import {NextApiRequest, NextApiResponse} from "next";
import {returnWithError, returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelNFT} from "server/helpers/models";

const RPC_NODE_URL = process.env.RPC_NODE_URL;

const customHttpProvider = new ethers.providers.JsonRpcProvider(RPC_NODE_URL);
export const treatResaleReader = new ethers.Contract(
	contractAddresses.treatMarketReader[56],
	ABI.treatMarketReader,
	customHttpProvider
);
export const treatMarketplaceContract = new ethers.Contract(
	contractAddresses.treatResaleMarketplaceMinter[56],
	ABI.treatMarketplace,
	customHttpProvider
);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {page, sort, market, tags: queryTags} = req.query;
	let tags: string[] | null = null;
	if ((queryTags as string)?.split(",").every((t: string) => t.length > 0)) {
		tags = (queryTags as string).split(",");
	}

	const sortMap = {
		recent: {
			created_at: -1,
		},
		popular: {
			views: -1,
		},
		expensive: {
			price: -1,
		},
		cheapest: {
			price: 1,
		},
	};

	const config: {
		page: number;
		sort: string;
		market: "resale" | "melon" | "totm" | "verified";
		tags?: string[];
		ids?: string[];
	} = {
		page: parseInt((page as string) ?? "1"),
		sort: sortMap[sort as string] || sortMap.recent,
		market: (market as any) || "verified",
		tags: tags || [],
	};

	if (!["melon", "totm", "resale", "verified"].includes(config.market))
		return returnWithError("Invalid market", 400, res);

	if (market === "resale") {
		console.log(await customHttpProvider.ready);

		const _id = await treatMarketplaceContract.functions.maxTokenId();
		const openOrders = await fetchOrders(_id);
		console.log({_id, openOrders});
		config.ids = ["0x495f947276749ce646f68ac8c248420045cb7b5e"];
	}

	const lookupConfig: {
		id?: any;
		tags?: any;
		melon_nft?: any;
		totm_nft?: any;
	} = {
		melon_nft: {
			$exists: false,
		},
		totm_nft: {
			$exists: false,
		},
	};

	if (config.ids && config.ids.length > 0) {
		lookupConfig.id = {
			$in: config.ids,
		};
	}
	if (config.tags && config.tags.length > 0) {
		lookupConfig.tags = {
			$in: config.tags,
		};
	}
	if (config.market === "melon") {
		lookupConfig.melon_nft = true;
	}
	if (config.market === "totm") {
		lookupConfig.totm_nft = true;
	}

	if (config.market === "resale") {
		delete lookupConfig.melon_nft;
		delete lookupConfig.totm_nft;
	}

	// @ts-ignore
	const nfts = await MongoModelNFT.paginate(lookupConfig, {
		page: config.page,
		limit: 20,
		sort: config.sort,
	});

	console.log({nfts});

	nfts.docs = await MongoModelNFT.populate(nfts.docs, {
		path: "creator",
		populate: "profile",
	});

	return returnWithSuccess(nfts, res);
}

const fetchOrders = async (maxId: number) => {
	const rangeArray = [];

	for (let i = 1; i <= Number(maxId); i++) {
		if (i % 5 === 0) {
			rangeArray.push({
				min: i - 5,
				max: i,
			});
		} else if (i === Number(maxId)) {
			rangeArray.push({
				min: rangeArray[rangeArray.length - 1].max,
				max: i,
			});
		}
	}

	const orders = await Promise.allSettled(
		rangeArray.map((a) => {
			// eslint-disable-next-line no-async-promise-executor
			return new Promise(async (resolve, reject) => {
				try {
					const order =
						await treatResaleReader.functions.readOrderPricesForNftRange(
							a.min,
							a.max
						);
					resolve(order);
				} catch (error) {
					reject(error);
				}
			});
		})
	);

	const singleArray = [].concat(...orders);

	const ids = singleArray.map((o) => o.nftId);
	const filtered = singleArray.filter(
		({id}, index) => !ids.includes(id, index + 1)
	);

	return filtered;
};
