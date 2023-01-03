import mongoose from "mongoose";
import createMongoDBModel from "../../utils";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const CreatorSchema = new mongoose.Schema(
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
			cost: {
				type: Number,
				required: true,
				default: 0,
			},
			description: {
				type: String,
				required: true,
				default: "",
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
		identity_access_key: {
			type: String,
		},
		approved: {
			type: Boolean,
			default: false,
		},
		pending: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

CreatorSchema.plugin(paginate);
CreatorSchema.plugin(aggregatePaginate);

const ModelCreator = createMongoDBModel("Creator", CreatorSchema);
export default ModelCreator;
