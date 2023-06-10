import {Client, cacheExchange, fetchExchange} from "urql";

export const TREAT_OLD_GRAPH = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/graphql`;
export const TREAT_NEW_GRAPH = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/graphql`;
export const SUBGRAPH_GRAPHQL_URL = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/graphql`;

export const treatGraphClient = new Client({
	url: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/graphql`,
	exchanges: [cacheExchange, fetchExchange],
});
