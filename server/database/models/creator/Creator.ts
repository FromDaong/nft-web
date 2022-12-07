import mongoose from "mongoose";
import createMongoDBModel from "@db/engine/utils";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const ModelSchema = new mongoose.Schema(
	{
		creatorId: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			unique: "Username is already taken",
			required: [true, "Please add a Model username"],
		},
		address: {
			type: String,
			required: true,
		},
		totm: {
			type: Boolean,
		},
		totm_end: {
			type: Date,
		},
		identity_access_key: {
			type: String,
		},
		bundle_id: {
			type: String,
		},
		live: {
			stream_id: String,
			playback_id: String,
			stream_key: String,
			banned: [
				{
					id: String,
				},
			],
		},
		subscription: {
			price: {
				type: Number,
			},
			description: {
				type: String,
			},
			enabled: {
				type: Boolean,
			},
		},
		livestream_active: {
			type: Boolean,
			default: false,
		},
		subscriptions_enabled: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

ModelSchema.plugin(aggregatePaginate);
ModelSchema.plugin(paginate);
ModelSchema.plugin(require("mongoose-beautiful-unique-validation"));

const ModelCreator = createMongoDBModel("Model", ModelSchema);
export default ModelCreator;
