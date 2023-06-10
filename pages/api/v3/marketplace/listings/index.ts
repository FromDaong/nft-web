import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import {ethers} from "ethers";
import {NextApiRequest, NextApiResponse} from "next";
import {returnWithError, returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelNFT, MongoModelProfile} from "server/helpers/models";
import {request, gql} from "graphql-request";
import {graphql_endpoints as markets} from "./queries";
import Web3 from "web3";
import formatAddress from "@utils/formatAddress";
import {SUBGRAPH_GRAPHQL_URL} from "@lib/graphClients";

const RESALE_GRAPHQL_ENDPOINT =
	"https://api.thegraph.com/subgraphs/name/treatdaodev/treatdao";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {page, sort, market, tags: queryTags} = req.query;
	let tags: string[] | null = null;
	if ((queryTags as string)?.split(",").every((t: string) => t.length > 0)) {
		tags = (queryTags as string).split(",");
	}

	const graphqlSort = {
		resale: ["cost", "currentSupply", "isActive"],
		market: ["totalSales", "totalSupply"],
	};

	const sortMap = {
		recent: {
			created_at: -1,
		},
		oldest: {
			created_at: 1,
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
		resaleOrders?: {
			cost: string;
			seller: string;
			nft: string;
		}[];
	} = {
		page: parseInt((page as string) ?? "1"),
		sort: sortMap[sort as string] || sortMap.recent,
		market: (market as any) || "verified",
		tags: tags || [],
	};

	if (!["melon", "totm", "resale", "verified"].includes(config.market))
		return returnWithError("Invalid market", 400, res);

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
		delete lookupConfig.totm_nft;
	}
	if (config.market === "totm") {
		lookupConfig.totm_nft = true;
		delete lookupConfig.melon_nft;
	}

	if (config.market === "resale" || config.market === "verified") {
		delete lookupConfig.melon_nft;
		delete lookupConfig.totm_nft;
	}

	if (config.market !== "resale") {
		let nfts;
		const {tokens} = await request(SUBGRAPH_GRAPHQL_URL, markets.sold_out);

		const soldOutIDs = tokens.map((token) => +token.identifier);
		console.log({soldOutIDs});
		if (market === "verified") {
			// @ts-ignore
			nfts = await MongoModelNFT.paginate(
				{
					$or: [
						{
							totm_nft: false,
						},
						{
							totm_nft: {
								$exists: false,
							},
						},
						{
							melon_nft: false,
						},
						{
							melon_nft: {
								$exists: false,
							},
						},
					],
					$and: [
						{
							id: {
								$gte: +process.env.NEXT_PUBLIC_V2_NFT_START ?? 92,
							},
						},
						{
							id: {
								$nin: soldOutIDs,
							},
						},
					],
				},
				{
					page: config.page,
					limit: 24,
					sort: config.sort,
				}
			);
		} else {
			// @ts-ignore
			nfts = await MongoModelNFT.paginate(lookupConfig, {
				page: config.page,
				limit: 24,
				sort: config.sort,
			});
		}

		nfts.docs = await MongoModelNFT.populate(nfts.docs, {
			path: "creator",
			populate: "profile",
		});

		return returnWithSuccess(nfts, res);
	}

	const {marketItems} = await request(RESALE_GRAPHQL_ENDPOINT, markets.resale, {
		sort: graphqlSort.resale.includes(sort as string) ? sort : "cost",
		// sort: "id" as "totalSales" | "totalSupply" | "id",
		skip: (config.page - 1) * 24,
		first: 24,
	});
	config.ids = marketItems.map((m) => m.nft);
	config.resaleOrders = marketItems.map((m) => ({
		cost: m.cost,
		seller: m.seller,
		nft: m.nft,
	}));

	const nfts = await MongoModelNFT.find({
		id: {
			$in: config.ids,
		},
	});

	const populatedNfts = await Promise.all(
		nfts.map(async (nft) => {
			const order = config.resaleOrders.find((o) => parseInt(o.nft) === nft.id);
			const seller = await MongoModelProfile.findOne({
				address: order.seller.toLowerCase(),
				// display_name: formatAddress(order.seller.toLowerCase()),
				// username: formatAddress(order.seller.toLowerCase()),
			}).exec();
			const nftprice = Web3.utils.fromWei(order.cost);
			const nftSeller = {
				...seller?.toObject(),
				address: order.seller.toLowerCase(),
			};
			return {
				...nft.toObject(),
				price: nftprice,
				seller: nftSeller,
			};
		})
	);

	return returnWithSuccess(
		{
			docs: populatedNfts.flat(),
			totalDocs: 10000,
			hasNextPage: true,
			hasPrevPage: config.page > 1,
			page: config.page,
			nextPage: config.page + 1,
		},
		res
	);
}
