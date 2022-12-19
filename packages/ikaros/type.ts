export type Session = {
	addres: string;
	user: {
		address: string;
		createdAt: string;
	};
	profile?: {
		_id: string;
		username: string;
		profile_pic: string;
		display_name: string;
		bio: string;
	};
	creator?: {
		_id: string;
		totm: string;
	};
};

export type RequestBody = {
	query?: {[key: string]: string};
	data?: {
		[key: string]: string;
	};
};

export type Response = {
	timestamp: string;
};

interface ClientRequest {
	fingerprint: string;
	timestamp: string;
	metadata: {
		ip_address: string;
		resolved_location: string;
	};
	requestBody: RequestBody;

	getSession: () => Session;
	getRequestBody: () => RequestBody;
}

type SectionsTypes =
	| "recommended"
	| "popular"
	| "based on your history"
	| "you might love"
	| "latest"
	| "feeling lucky"
	| "curated";

type ContentTypes =
	| "creator"
	| "post"
	| "subscription"
	| "collection"
	| "banner"
	| "toast";

type SkeletonStructure = {
	width: number;
	height: number;
	borderRadius: number;
	gap: number;
	pulse?: boolean;
};
