import {returnWithSuccess} from "@db/engine/utils";
import {
	treatMarketplaceContract,
	treatMarketplaceReaderContract,
} from "@packages/treat/lib/contract-defs";
import {formatOpenOrders} from "@utils/chain-methods";
import {PaginationManager} from "@utils/pagination";
import {NFTSearchManager} from "@utils/search";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelNFT} from "server/helpers/models";

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

	console.log(formatOpenOrders.length);

	const nfts = await MongoModelNFT.find({
		id: {
			$in: Array.from(new Set(formatedOrders.map((order) => order.nftId))),
		},
	}).populate("creator");

	const populatedNFTOrders = nfts
		.map((nft) => {
			const metadata = nft;
			const doc = formatedOrders.find((doc) => nft.id === doc.nftId);

			if (!metadata) return;

			return {
				_id: metadata._id,
				listDate: doc.listDate,
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
				list_price: doc.price,
			};
		})
		.filter((order) => !!order);

	const searchManager = new NFTSearchManager(populatedNFTOrders);
	searchManager.hydrate();
	const searchResults = await searchManager.search(q as string);
	const paginationManager = new PaginationManager(
		populatedNFTOrders
			.filter((nft) => searchResults.includes(nft.id))
			.map((order) => ({
				...order,
				list_price: Number(order.list_price),
			}))
	);

	return returnWithSuccess(
		paginationManager.paginate(
			Number((page as string) ?? 1),
			sort === "1"
				? paginationManager.cheapestFirst()
				: sort === "2"
				? paginationManager.expensiveFirst()
				: paginationManager.newestFirst()
		),
		res
	);
};

export default handler;
