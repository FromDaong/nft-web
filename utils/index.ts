import {TPost} from "@packages/post/types";
import BigNumber from "bignumber.js";
import {MathUtil} from "./math";
import {ReactUtil} from "./react";
import {formatDistance} from "date-fns";

export const timeFromNow = (date: string) =>
	formatDistance(new Date(date), new Date(), {addSuffix: true});

export {default as formatAddress} from "./formatAddress";

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
	return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber();
};

export const decToBn = (dec: number, decimals = 18) => {
	return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};

export const legacy_nft_to_new = (post: any): TPost => ({
	name: post.name,
	image: {
		cdn: post.image.cdn,
		ipfs: post.image.ipfs,
	},
	price: {
		value: post.list_price,
		currency: "BNB",
	},
	id: post.id,
	blurhash:
		post.blurhash ||
		"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
	post_type: "colletible",
	author: {
		username: post.creator.username,
		display_name: post.creator.display_name,
		live: true,
		avatar: post.creator.profile_picture,
	},
	collection: {
		name: post.collection_name,
		totalSupply: Number(post.max_supply),
		minted: post.mints?.length,
		avatar: post.collection_avatar,
	},
	protected: post.protected,
});

export const apiEndpoint = "/api/v3";

export {MathUtil, ReactUtil};
