export type TChatParticipant = {
	username: string;
	profile_pic?: string;
	display_name: string;
	_id: string;
};

export type TMessage = {
	timestamp: number;
	text: string;
	sender: TChatParticipant;
};

export type TChatBucket = {
	date: number;
	messageBuckets: Array<{
		sender: TChatParticipant;
		messages: Array<TMessage>;
	}>;
};

export type TChat = {
	participants: [TChatParticipant];
	buckets: Array<TChatBucket>;
};

export type ChatApiResponse = {
	docs: Array<TMessage>;
	page: number;
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
	totalPages: number;
	totalDocs: number;
};
