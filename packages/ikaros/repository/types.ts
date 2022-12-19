export type HydratedTimeline = {
	timestamp: string;
	totalItems: string;
	lastUpdated: string;
};
export interface Timeline {
	profile: {
		user_id: string;
		username: string;
		_id: string;
	};
	fingerprint: string;

	getTimeline: (_id) => HydratedTimeline;
}
