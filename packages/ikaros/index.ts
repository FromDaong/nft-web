import {ClientRequest, ClientResponse} from "./type";
import {Session, RequestBody} from "./type";
/*
    Author: Kamfeskaya
    Description: Ikaros is a portable recommendation algorithm for TreatDAO Platform
*/

export class IkarosHelpers {
	static getComponentType() {}
	static getDeviceType() {}
	static getNavigatorConnection() {}
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

export class IkarosResponse implements ClientResponse {
	timestamp: string;
}

export class IkarosInterface {
	components: object;

	onReceivePayload = (payload: object) => {};
	onIntersectionTriggered = (payload: object) => {};
}

// TODO: Check if we are at 5 items from last and fetch new ones
// TODO: If there are not any more recommendations, get recommendations for platform overall
