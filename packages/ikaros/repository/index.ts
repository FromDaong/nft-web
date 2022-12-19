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

export class IkarosRequest implements ClientRequest {
	fingerprint: string;
	timestamp: string;
	metadata: {ip_address: string; resolved_location: string};
	session: Session;
	requestBody: RequestBody;

	getSession = (): Session => {};
	getRequestBody = (): RequestBody => {};
}

export class IkarosResponse implements Response {
	timestamp: string;
}
