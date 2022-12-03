export interface IMongoPost {
	postId: string;
	nftId: number;
	text: string;
	blurhash?: string;
	thumbnail?: string;
	privacy: "subscription" | "everyone" | "followers" | "owner";
	postType: "collectible" | "subscription_content";
	totm?: {
		timestamp: number;
		validUntil: number;
		active: boolean;
	};
	isOldTOTM?: boolean;
	inGrid?: boolean;
	isProtected?: boolean;
	price?: {
		value: number;
		currency: "TREAT" | "USDC" | "BNB";
	};
	media: {
		mediaType: "IMAGE" | "VIDEO";
		ipfs: string;
		cdn: string;
	};
	creator: {
		address: string;
	};
	tritCollection: {
		id: string;
	};
	stats: {
		impressions: number;
		clicks: number;
	};
}

export interface IPost {
	postId: string;
	nftId: number;
	text: string;
	blurhash?: string;
	thumbnail?: string;
	privacy: "subscription" | "everyone" | "followers" | "owner";
	postType: "collectible" | "subscription";
	totm?: I_Post_TOTM;
	isOldTOTM?: boolean;
	inGrid?: boolean;
	isProtected?: boolean;
	price?: {
		value: number;
		currency: string;
	};
	media: {
		mediaType: "IMAGE" | "VIDEO";
		ipfs: string;
		cdn: string;
	};
	creator: I_Post_Creator;
	event?: I_Post_TimelineEvent;
	tritCollection: I_Post_TritCollection;
	stats: {
		impressions: number;
		clicks: number;
	};
	likes?: Array<{I_Post_Like}>;
	collectors?: Array<I_Post_Collector>;
}

export interface I_Post_Creator {
	username?: string;
	display_name?: string;
	address: string;
	profilePicture?: string;
	bio?: string;
	isLive?: boolean;
}

export interface I_Post_TOTM {
	timestamp: number;
	validUntil: number;
	active: boolean;
}

export interface I_Post_TimelineEvent {
	type: "like" | "comment" | "create" | "offer" | "collect";
	timestamp: string;
	actor: {
		username: string;
		displayName: string;
		profilePicture: string;
		isLive: string;
	};
}

export interface I_Post_Like {
	id: string;
	address: string;
	timestamp: string;
}

export interface I_Post_TritCollection {
	id: string;
	name?: string;
	totalSupply?: number;
	totalMinted?: number;
}

export interface I_Post_Collector {
	id: string;
	text: string;
	actor: {
		username: string;
		displayName: string;
		profilePicture: string;
		address: string;
	};
	timestamp: string;
	transaction: {
		txId: string;
		txHash: string;
	};
}
