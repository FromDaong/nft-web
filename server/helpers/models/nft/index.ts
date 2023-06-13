import mongoose, {Query} from "mongoose";
import createMongoDBModel from "../../utils";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const NFTSchema = new mongoose.Schema(
	{
		id: {
			type: Number,
			required: true,
		},
		seller: {
			type: String,
			required: true,
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Creator",
			required: true,
		},
		price: {
			type: Number,
			required: true,
			default: 0.0,
		},
		listDate: {
			type: Number,
		},
		tx_hash: {
			type: String,
		},
		name: {
			type: String,
			required: [true, "Please add an NFT name"],
		},
		description: {
			type: String,
			required: [true, "Please add an NFT description"],
		},
		external_url: {
			type: String,
			required: [true, "Please add an NFT external url"],
			default: "https://treatdao.com/api/v3/nft",
		},
		image: {
			cdn: {
				type: String,
				required: [true, "Please add an CDN url"],
			},
			ipfs: {
				type: String,
				required: [true, "Please add an IPFS url"],
			},
		},
		type: {
			type: String,
			default: "image",
			required: true,
		},
		blurhash: {
			type: String,
		},
		max_supply: {
			type: Number,
			required: [true, "Please add max supply"],
		},
		totm_nft: {
			type: Boolean,
		},
		melon_nft: {
			type: Boolean,
		},
		subscription_nft: {
			type: Boolean,
		},
		attributes: [
			{
				trait_type: {type: String, required: true},
				value: {type: String, required: true},
			},
		],
		tags: [],
		protected: {
			type: Boolean,
			required: false,
			default: false,
		},
		likedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Profile",
			},
		],
		nftCollection: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "NFTCollection",
			required: false,
		},
		views: [
			{
				type: String,
			},
		],
		purchases: [
			{
				type: String,
			},
		],
		listedDate: {
			type: Number,
		},
		thumbnail: String,
		sd_image: String,
		blurred_image: String,
	},
	{
		timestamps: {createdAt: true, updatedAt: false},
	}
);

NFTSchema.plugin(paginate);
NFTSchema.plugin(aggregatePaginate);

NFTSchema.pre<Query<any, any>>("find", function () {
	// Add the condition that id > 30 to the query
	this.where({id: {$gt: process.env.NEXT_PUBLIC_V2_NFT_START}});
});

const NFTModel = createMongoDBModel("V2NFT", NFTSchema);

export default NFTModel;
