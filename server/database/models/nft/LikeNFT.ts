import createMongoDBModel from "server/database/engine/utils";
const mongoose = require("mongoose");

const LikeNFTSchema = new mongoose.Schema(
	{
		nftId: {
			type: Number,
			required: [true, "Please add an NFT ID"],
			unique: "ID is already taken",
		},
		username: {
			type: String,
			required: [true, "Please add a username"],
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

const LikeNFT = createMongoDBModel("LikeNFT", LikeNFTSchema);

export default LikeNFT;
