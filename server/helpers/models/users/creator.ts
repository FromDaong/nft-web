import mongoose from "mongoose";
import createMongoDBModel from "../../utils";

const ModelSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: "Username is already taken",
			required: [true, "Please add a Model username"],
		},
		address: {
			type: String,
			required: [true, "Please add an address"],
			unique: [true, "Address is already taken"],
		},
		totm: {
			current: {
				type: Boolean,
				default: false,
			},
			startDate: {
				type: Date,
			},
			endDate: {
				type: Date,
			},
		},
		bundle_id: {
			type: String,
		},
		identity_access_key: {
			type: String,
		},
		livestreaming_detail: {
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
			type: mongoose.Schema.Types.ObjectId,
			required: false,
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
		profile: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Profile",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

const ModelCreator = createMongoDBModel("Creator", ModelSchema);
export default ModelCreator;
