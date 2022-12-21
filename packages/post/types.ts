export type TritPostProps = {
	_id: string;
	id: string;
	name?: string;
	text?: string;
	blurhash: string;
	image?: {
		cdn: string;
		ipfs: string;
	};
	author: {
		display_name: string;
		username: string;
		avatar: string;
		bio?: string;
		live?: boolean;
		address?: string;
	};
	subscription?: {
		id: string;
		price: {
			value: number;
			currency: string;
		};
	};
	likes?: Array<{
		user: {
			username: string;
			avatar: string;
		};
		timestamp: number;
	}>;
	collected?: Array<{
		user?: {
			username: string;
			avatar: string;
		};
		address: string;
		tx: string;
		timestamp: number;
	}>;
	timestamp?: number;
	post_type: "colletible" | "subscription";
	price?: {
		value: number;
		currency: string;
		bigNumber?: any;
	};
	collection?: {
		name: string;
		minted: number;
		totalSupply: number;
		avatar: string;
	};
	seller?: string;
	likedBy?: Array<string>;
	protected?: boolean;
	totm?: boolean;
	subscription_nft?: boolean;
	noPrice?: boolean;
	inGrid?: boolean;
	isResale?: boolean;
	isMine?: boolean;
	isSoldOut?: boolean;
};

export type LivestreamPost = {
	id: string;
	name?: string;
	text?: string;
	blurhash: string;
	image?: {
		cdn: string;
		ipfs: string;
	};
	author: {
		display_name: string;
		username: string;
		avatar: string;
	};
	subscription?: {
		id: string;
		price: {
			value: number;
			currency: string;
		};
	};
	likes?: Array<{
		user: {
			username: string;
			avatar: string;
		};
		timestamp: number;
	}>;
	timestamp?: number;
};
