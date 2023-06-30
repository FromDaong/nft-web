import mongoose from "mongoose";
import createMongoDBModel from "../../utils";

export const WishlistSchema = new mongoose.Schema(
	{
		nfts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "V2NFT",
				required: true,
			},
		],
		profile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Profile",
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

const ModelWishlist = createMongoDBModel("Wishlist", WishlistSchema);

export default ModelWishlist;
