import request, {gql} from "graphql-request";
import {NextApiRequest, NextApiResponse} from "next";
import {returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelNFT, MongoModelProfile} from "server/helpers/models";
import Web3 from "web3";

const RESALE_GRAPHQL_ENDPOINT =
	"https://api.thegraph.com/subgraphs/name/treatdaodev/treatdao";

const query = gql`
	query listings($address: String!, $skip: Int!, $first: Int!, $sort: String!) {
		marketItems(
			orderBy: $sort
			orderDirection: desc
			skip: $skip
			first: $first
			where: {seller: $address}
		) {
			nft
			currentSupply
			cost
			isActive
			transactionHash
			seller
		}
	}
`;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {seller_address, page, sort} = req.query;
	const {marketItems} = await request(RESALE_GRAPHQL_ENDPOINT, query, {
		sort: (sort as string) ?? "cost",
		// sort: "id" as "totalSales" | "totalSupply" | "id",
		skip:
			parseInt(page as string) > 1 ? (parseInt(page as string) - 1) * 24 : 0,
		first: 24,
		address: (seller_address as string).toLowerCase(),
	});

	const ids = marketItems.map((item) => item.nft);
	const nfts = await MongoModelNFT.find({
		id: {
			$in: ids,
		},
	}).populate({
		path: "creator",
		populate: {
			path: "profile",
		},
	});

	const populatedNfts = await Promise.all(
		nfts.map(async (nft) => {
			const order = marketItems.find((o) => parseInt(o.nft) === nft.id);
			const thisSeller = await MongoModelProfile.findOne({
				address: (seller_address as string).toLowerCase(),
			}).exec();

			const nftprice = Web3.utils.fromWei(order.cost);
			const nftSeller = {
				...thisSeller?.toObject(),
				address: seller_address,
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
			hasPrevPage: +page > 1,
			page: +page,
			nextPage: +page + 1,
		},
		res
	);
}
