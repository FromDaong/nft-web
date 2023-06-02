import {Client, cacheExchange, fetchExchange} from "urql";

const TREAT_OLD_GRAPH =
	"https://api.thegraph.com/subgraphs/name/0x6e6f6c61/treat";
const TREAT_NEW_GRAPH =
	"https://api.thegraph.com/subgraphs/name/0x6e6f6c61/treat";

export const treatOldGraphClient = new Client({
	url: TREAT_OLD_GRAPH,
	exchanges: [cacheExchange, fetchExchange],
});

export const treatNewGraphClient = new Client({
	url: TREAT_NEW_GRAPH,
	exchanges: [cacheExchange, fetchExchange],
});
