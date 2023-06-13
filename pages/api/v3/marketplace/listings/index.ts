import {NextApiRequest, NextApiResponse} from "next";
import {returnWithError, returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelNFT, MongoModelProfile} from "server/helpers/models";
import {request} from "graphql-request";
import {graphql_endpoints as markets} from "./queries";
import Web3 from "web3";
import {SUBGRAPH_GRAPHQL_URL} from "@lib/graphClients";
import formatAddress from "@utils/formatAddress";

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

	const sortMap = {
		newest: {
			createdAt: -1,
		},
		oldest: {
			createdAt: 1,
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
		sort: sortMap[sort as string] || sortMap.newest,
		market: (market as any) ?? "verified",
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

		const andMap: any[] = [
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
		];

		if (tags?.length > 0) andMap.push({tags: {$in: tags}});

		if (config.market === "verified") {
			console.log({sort: config.sort, market: config.market});

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
					$and: andMap,
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

		nfts.docs.map((nft) => {
			console.log(nft.createdAt);
		});

		return returnWithSuccess(nfts, res);
	}

	let sortKey = "timestamp";
	if (sort === "expensive") sortKey = "cost";
	if (sort === "cheapest") sortKey = "cost";
	if (sort === "newest") sortKey = "timestamp";
	if (sort === "oldest") sortKey = "timestamp";

	const {marketItems} = await request(RESALE_GRAPHQL_ENDPOINT, markets.resale, {
		sort: sortKey,
		// sort: "id" as "totalSales" | "totalSupply" | "id",
		skip: (config.page - 1) * 24,
		first: 24,
		direction: sort === "cheapest" || sort === "oldest" ? "asc" : "desc",
	});
	config.ids = marketItems.map((m) => m.nft);
	config.resaleOrders = marketItems.map((m) => ({
		cost: m.cost,
		seller: m.seller,
		nft: m.nft,
	}));

	const lookupMap: any[] = [
		{
			id: {
				$in: config.ids,
			},
		},
	];
	if (tags?.length > 0) lookupMap.push({tags: {$in: tags}});

	const nfts = await MongoModelNFT.find({
		$and: lookupMap,
	}).populate({
		path: "creator",
		populate: "profile",
	});

	const populatedNfts = await Promise.all(
		nfts.map(async (nft) => {
			const order = config.resaleOrders.find((o) => parseInt(o.nft) === nft.id);
			const seller = await MongoModelProfile.findOne({
				address: order.seller.toLowerCase(),
			}).exec();
			const nftprice = Web3.utils.fromWei(order.cost);
			const nftSeller = {
				address: order.seller.toLowerCase(),
				display_name: formatAddress(order.seller.toLowerCase()),
				username: formatAddress(order.seller.toLowerCase()),
				...seller?.toObject(),
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
			hasNextPage: marketItems.length === 24,
			hasPrevPage: config.page > 1,
			page: config.page,
			nextPage: config.page + 1,
		},
		res
	);
}
