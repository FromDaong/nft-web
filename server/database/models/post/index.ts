import {IMongoPost} from "core/types";
import {model, Schema, Document} from "mongoose";

export interface PostDocument extends Document, IMongoPost {}

const PostSchema = new Schema({
	postId: {
		type: String,
		required: true,
	},
	nftId: {
		type: Number,
		required: true,
	},
	text: String,
	blurhash: String,
	thumbnail: String,
	privacy: {
		type: String,
		enum: ["subscription", "everyone", "followers", "owner"],
		required: true,
		default: "everyone",
	},
	postType: {
		type: String,
		enum: ["collectible", "subscription_content"],
		required: true,
	},
	totm: {
		timestamp: Number,
		validUntil: Number,
		active: Boolean,
	},
	isOldTOTM: {
		type: Boolean,
		default: false,
	},
	inGrid: Boolean,
	isProtected: {
		type: Boolean,
		default: false,
	},
	price: {
		value: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			enum: ["TREAT", "USDC", "BNB"],
			required: true,
		},
	},
	media: {
		mediaType: {
			type: String,
			enum: ["IMAGE", "VIDEO"],
			required: true,
		},
		ipfs: String,
		cdn: String,
	},
	creator: {
		address: {
			type: String,
			required: true,
		},
	},
	tritCollection: {
		id: {
			type: String,
			required: true,
		},
	},
	stats: {
		impressions: {
			type: Number,
			default: 0,
			required: true,
		},
		clicks: {
			type: Number,
			default: 0,
			required: true,
		},
	},
});

const PostModel = model<PostDocument>("Post", PostSchema);

export default PostModel;
