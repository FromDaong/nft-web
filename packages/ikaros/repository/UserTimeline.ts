import {HydratedTimeline, Timeline} from "./types";
export default class UserTimeline implements Timeline {
	profile: {user_id: string; username: string; _id: string};
	fingerprint: string;
	getTimeline: (_id: any) => HydratedTimeline;
}
