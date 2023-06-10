import {connectMongoDB} from "@db/engine";
import {returnWithError, returnWithSuccess} from "@db/engine/utils";
import {MongoModelCreator, MongoModelNFT} from "server/helpers/models";
import request, {gql} from "graphql-request";
import {SUBGRAPH_GRAPHQL_URL} from "@lib/graphClients";

const query = gql`
	query owned($address: String!, $first: Int!, $skip: Int!) {
		balances(
			first: $first
			skip: $skip
			where: {account_contains_nocase: $address}
		) {
			id
			value
			token {
				identifier
			}
		}
	}
`;

const allOwned = gql`
	query allOwned($address: String!) {
		balances(first: 1000, where: {account_contains_nocase: $address}) {
			id
		}
	}
`;

export default async function handler(req, res) {
	const {address} = req.query;
	let {p} = req.query;

	if (!p) p = 1;
	if (+p < 1) p = 1;

	if (!address) {
		return returnWithError("No address provided", 400, res);
	}

	await connectMongoDB();

	const {balances} = await request(SUBGRAPH_GRAPHQL_URL, query, {
		address: (address as string).toLowerCase(),
		first: 24,
		skip: p < 2 ? 0 : (p - 1) * 24,
	});
	const total = await request(SUBGRAPH_GRAPHQL_URL, allOwned, {
		address: (address as string).toLowerCase(),
	});

	let nfts = balances.map((nft) => ({
		id: nft.token.identifier,
		amount: nft.value,
	}));

	nfts = nfts.filter((nft) => nft.amount !== 0);
	const nftsIds = nfts.map((nft) => nft.id);

	const nftDocs = await MongoModelNFT.find({
		id: {
			$in: nftsIds,
		},
	})
		.populate({
			path: "creator",
			select: "username address bio profile",
			populate: {
				path: "profile",
				select: "username profile_pic",
			},
		})
		.exec();

	return returnWithSuccess(
		{
			docs: nftDocs.map((nft) => {
				const count = nfts.find((n) => +n.id === +nft.id).amount;
				return {...nft.toObject(), count};
			}),
			hasNextPage: true,
			nextPage: +p + 1,
			page: Number(p),
			total: total.balances.length,
			totalPages: Math.ceil(total.balances.length / 24),
		},
		res
	);
}
