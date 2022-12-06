import createMongoDBModel from "@db/engine/utils";
import {Document, Schema} from "mongoose";

export type TSubscriptionPackage<Document> = {
	value: number;
	currency: string;
	profileId: string;
};

export const HSubscriptionPackage: Schema = new Schema(
	{
		price: {
			type: Number,
			required: true,
			default: 0.1,
		},
		description: {
			type: String,
			required: true,
			default: "Monthly Subscription",
		},
		creatorId: {
			type: String,
			required: true,
		},
		enabled: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

const ModelSubscriptionPackage = createMongoDBModel(
	"Subscription",
	HSubscriptionPackage
);

export default ModelSubscriptionPackage;
