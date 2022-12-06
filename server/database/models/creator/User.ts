import mongoose from "mongoose";
import createMongoDBModel from "server/database/engine/utils";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const ModelSchema = new mongoose.Schema(
	{
		display_name: {
			type: String,
			default: "",
		},
		username: {
			type: String,
			unique: "Username is already taken",
			required: [true, "Please add a Model username"],
		},
		bio: {
			type: String,
			required: [true, "Please add a Model bio"],
		},
		isModel: {
			type: Boolean,
			// Default to show creator flag
			default: true,
		},
		totm: {
			type: Boolean,
		},
		totw: {
			type: Boolean,
		},
		totw_end: {
			type: Date,
		},
		profile_pic: {
			type: String,
			default: "",
		},
		profilePicCdnUrl: {
			type: String,
		},
		daoProfilePicCdnUrl: {
			type: String,
		},
		banner_pic: {
			type: String,
			default:
				"https://treatdao.mypinata.cloud/ipfs/QmdRewQfGbQP95hcyabRwRnXKWFH8Lyrr8ak6xc2y4uWTP",
		},
		social_account: {
			type: String,
			default: "",
		},
		address: {
			type: String,
			required: true,
		},
		email: {
			type: String,
		},
		pending: {
			type: Boolean,
		},
		rejected: {
			type: Boolean,
		},
		hidden: {
			type: Boolean,
		},
		referrer_address: {
			type: String,
		},
		identity_access_key: {
			type: String,
		},
		bundle_id: {
			type: String,
		},
		live_chat_enabled: {
			type: Boolean,
			default: false,
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
		nfts: [
			{
				id: String,
			},
		],
		sub_nfts: [
			{
				id: String,
			},
		],
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
		referred: [],
		livestream_active: {
			type: Boolean,
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

const ModelUser = createMongoDBModel("Model", ModelSchema);
export default ModelUser;
