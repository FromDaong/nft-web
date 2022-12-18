/*
    Author: Kamfeskaya
    Description: Ikaros is a portable recommendation algorithm for TreatDAO Platform
*/

type SectionsTypes =
	| "recommended"
	| "popular"
	| "based on your history"
	| "you might love"
	| "latest"
	| "curated";

type ContentTypes =
	| "creator"
	| "post"
	| "subscription"
	| "marketplace"
	| "collection"
	| "banner"
	| "toast";

export class IkarosHelpers {
	static getComponentType() {}
	static getDeviceType() {}
	static getNavigatorConnection() {}
}

export class IkarosInterface {
	components: object;

	onReceivePayload = (payload: object) => {};
	onIntersectionTriggered = (payload: object) => {};
}

// TODO: Check if we are at 5 items from last and fetch new ones
// TODO: If there are not any more recommendations, get recommendations for platform overall
