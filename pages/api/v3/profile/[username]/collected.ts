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
import {generateNewNFTFromOwnedButLostNFT} from "@lib/moralis";
import request, {gql} from "graphql-request";
import {SUBGRAPH_GRAPHQL_URL} from "@lib/graphClients";

const query = gql`
	query listings($address: String!) {
		{
			balances(
				where: {account_contains_nocase: $address}
			) {
				id
				value
				token {
				identifier
				}
			}
			}
	}
`;

export default async function handler(req, res) {
	const {address} = req.query;
	let {p} = req.query;

	if (!p) {
		p = 1;
	}

	if (!address) {
		return returnWithError("No username provided", 400, res);
	}

	await connectMongoDB();

	const {balances} = await request(SUBGRAPH_GRAPHQL_URL, query, {
		address: (address as string).toLowerCase(),
	});

	let nfts = balances.map((nft) => ({
		id: nft.token.identifier,
		amount: nft.value,
	}));
	nfts = nfts.filter((nft) => nft.amount !== 0);

	nfts = await MongoModelCreator.populate(
		nfts.map((nft) => nft.id),
		{
			path: "creator",
			select: "username address bio profile",
			populate: {
				path: "profile",
				select: "username profile_pic",
			},
		}
	);

	return returnWithSuccess(
		{
			docs: nfts,
			hasNextPage: true,
			nextPage: +p + 1,
			page: Number(p),
		},
		res
	);
}
