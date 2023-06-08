import {Client, cacheExchange, fetchExchange} from "urql";

export const TREAT_OLD_GRAPH =
	"https://api.thegraph.com/subgraphs/name/0x6e6f6c61/treat";
export const TREAT_NEW_GRAPH =
	"https://api.thegraph.com/subgraphs/name/treatdaodev/treatdao";

export const treatGraphClient = new Client({
	url: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/graphql`,
	exchanges: [cacheExchange, fetchExchange],
});
