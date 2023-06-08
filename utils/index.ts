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

export const legacy_nft_to_new = (post: any): TritPostProps => {
	console.log({post});
	return {
		_id: post._id,
		name: post.name,
		image: {
			cdn: post.image?.ipfs,
			ipfs: post.image?.ipfs,
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
		creator: {
			username: post.creator.username,
			display_name: post.creator.display_name,
			live: false,
			avatar: post.creator.profile?.profile_pic,
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
		melon_nft: post.melon_nft,
		max_supply: Number(post.max_supply),
		seller: post.seller,
		count: post.count,
	};
};

export const apiEndpoint = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3`;

export const ironOptions: IronSessionOptions = {
	cookieName: "siwe",
	password: "complex_password_at_least_32_characters_long",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

export {MathUtil, ReactUtil};

export function dataURLtoFile(dataurl, filename) {
	const arr = dataurl.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[arr.length - 1]);

	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, {type: mime});
}
