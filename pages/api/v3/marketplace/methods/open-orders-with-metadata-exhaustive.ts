import {returnWithSuccess} from "@db/engine/utils";
import {
	treatMarketplaceContract,
	treatMarketplaceReaderContract,
} from "@packages/treat/lib/contract-defs";
import {
	formatOpenOrders,
	OpenOrder,
	OpenOrdersManager,
} from "@utils/chain-methods";
import {legacy_nft_to_new} from "@utils/index";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelNFT} from "server/helpers/models";

const searchDBForNFTs = async (q: string): Promise<Array<number>> => {
	const nfts = await MongoModelNFT.aggregate([
		{
			$search: {
				index: "nfts",
				text: {
					query: `${q}`,
					path: ["name", "description"],
				},
			},
		},
	]).exec();

	const nftIds = nfts.map((nft) => nft.id);

	return nftIds;
};

const getMinMaxArray = (num) => {
	const arr = [];
	for (let i = 0; i < num; i += 50) {
		arr.push({
			min: i,
			max: i + 50,
		});
	}
	return arr;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await connectMongoDB();
	const {page, q, sort} = req.query;

	const maxId = await treatMarketplaceContract.maxTokenId();
	const minMax = getMinMaxArray(maxId.toNumber());

	const onChainOpenOrders = await Promise.all(
		minMax.map(async (a) => {
			const orders =
				await treatMarketplaceReaderContract.readOrderPricesForNftRange(
					a.min,
					a.max
				);

			const res = orders.sellers.map((o, i) => {
				return {
					seller: o,
					price: orders.prices[i],
					nftId: Number(orders.nftIds[i]),
					listDate: orders.listDates[i],
				};
			});
			return res;
		})
	);

	const formatedOrders = formatOpenOrders(
		onChainOpenOrders.flat().filter((order) => !!order)
	);
	const ordersManager = new OpenOrdersManager(
		formatedOrders as Array<OpenOrder>
	);

	const sortMap = {
		"1": {
			price: ordersManager.cheapestFirst,
		},
		"2": {
			price: ordersManager.expensiveFirst,
		},
		"3": {
			listedDate: ordersManager.newestFirst,
		},
	};

	const paginatedOpenOrders = ordersManager.paginate(
		1,
		sort === "1"
			? ordersManager.cheapestFirst()
			: sort === "2"
			? ordersManager.expensiveFirst()
			: ordersManager.newestFirst()
	);

	const orderIds = paginatedOpenOrders.docs.map((order) => order.nftId);

	const nfts = await MongoModelNFT.find({
		id: {
			$in: orderIds,
		},
	}).populate("creator");

	const docs = paginatedOpenOrders.docs
		.map((doc) => {
			const metadata = nfts.find((nft) => nft.id === doc.nftId);

			if (!metadata) return;

			return {
				_id: metadata._id,
				name: metadata.name,
				image: {
					cdn: metadata.image.ipfs,
					ipfs: metadata.image.ipfs,
				},
				price: {
					value: doc.price,
					currency: "BNB",
				},
				id: metadata.id,
				blurhash:
					metadata.blurhash ||
					"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
				post_type: "colletible",
				author: {
					username: metadata.creator.username,
					display_name: metadata.creator.display_name,
					live: true,
					avatar: metadata.creator.profile_picture,
				},
				collection: {
					name: metadata.collection_name,
					totalSupply: Number(metadata.max_supply),
					minted: metadata.mints?.length,
					avatar: metadata.collection_avatar,
				},
				likedBy: metadata.likedBy,
				protected: metadata.protected,
				totm: metadata.totm_nft,
				subscription_nft: metadata.subscription_nft,
				max_supply: Number(metadata.max_supply),
				count: metadata.count,
				seller: {
					address: doc.seller,
					username: metadata.creator.username,
					display_name: metadata.creator.display_name,
				},
				isResale: true,
				melon_nft: false,
			};
		})
		.filter((order) => !!order);

	return returnWithSuccess({...paginatedOpenOrders, docs}, res);
};

export default handler;
