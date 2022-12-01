import {Document, Schema} from "mongoose";

export type TSubscriptionPackage<Document> = {
	value: number;
	currency: string;
	profileId: string;
};

export const HSubscriptionPackage: Schema = new Schema({
	value: {
		type: Number,
		required: true,
		default: 0.1,
	},
	currency: {
		type: String,
		required: true,
		default: "BNB",
	},
	profileId: {
		type: String,
		required: true,
	},
});

export const SubscriptionPackage = {};
