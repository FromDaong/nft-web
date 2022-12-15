import mongoose from "mongoose";
import createMongoDBModel from "../../utils";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const NFTSchema = new mongoose.Schema(
	{
		id: {
			type: Number,
			required: [true, "Please add an NFT ID"],
			unique: "ID is already taken",
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
		price: {
			type: Number,
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
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Creator",
			required: true,
		},
		nftCollection: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "NFTCollection",
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: false},
	}
);

NFTSchema.plugin(paginate);
NFTSchema.plugin(aggregatePaginate);

const NFTModel = createMongoDBModel("MarketplaceNFT", NFTSchema);

export default NFTModel;
