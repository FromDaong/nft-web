// Tom is the analytics client for TreatDAO
// We call it the peeping-tom lol

import {Axios} from "axios";

type EventPayload = {
	channel: string;
	event: string;
	description: string;
	emoji: string;
	notify: boolean;
	tags: {
		[key: string]: string;
	};
};

export default class Tom {
	apiKey: string;
	client: Axios;
	endpoint: string;

	constructor(apiKey: string, apiEndpoint) {
		this.apiKey = apiKey;
		this.endpoint = apiEndpoint;
	}

	sendEvent(payload: EventPayload) {}

	sendFacebookEvent(key: string, payload: any) {}

	pageView(url: string, entity: string, user_id: string) {}
}
