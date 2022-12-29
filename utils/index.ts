import {TritPostProps} from "@packages/post/types";
import BigNumber from "bignumber.js";
import {MathUtil} from "./math";
import {ReactUtil} from "./react";
import {formatDistance} from "date-fns";
import {IronSessionOptions} from "iron-session";

export const timeFromNow = (date: string) =>
	formatDistance(new Date(date), new Date(), {addSuffix: true});

export {default as formatAddress} from "./formatAddress";

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
	return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber();
};

export const decToBn = (dec: number, decimals = 18) => {
	return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals));
};

export const legacy_nft_to_new = (post: any): TritPostProps => ({
	_id: post._id,
	name: post.name,
	image: {
		cdn: post.image.ipfs,
		ipfs: post.image.ipfs,
	},
	price: {
		value: post.price,
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
	likedBy: post.likedBy,
	protected: post.protected,
	totm: post.totm_nft,
	subscription_nft: post.subscription_nft,
	max_supply: Number(post.max_supply),
	seller: post.seller,
});

export const apiEndpoint = "/api/v3";

export const ironOptions: IronSessionOptions = {
	cookieName: "siwe",
	password: "complex_password_at_least_32_characters_long",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

export {MathUtil, ReactUtil};
