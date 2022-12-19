import {Schema} from "mongoose";
import createMongoDBModel from "../../utils";

export const Followers = createMongoDBModel(
	"Follower",
	new Schema(
		{
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
			followedBy: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
		},
		{
			timestamps: {
				createdAt: true,
				updatedAt: true,
			},
		}
	)
);

export const Following = createMongoDBModel(
	"Following",
	new Schema(
		{
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
			following: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
		},
		{
			timestamps: {
				createdAt: true,
				updatedAt: true,
			},
		}
	)
);

export const SubscribedBy = createMongoDBModel(
	"SubscribedBy",
	new Schema(
		{
			subscription: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Subscription",
			},
			subscribedTo: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Creator",
			},
			subscribedBy: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
			tx: {
				type: Schema.Types.ObjectId,
				required: true,
			},
		},
		{
			timestamps: {
				createdAt: true,
				updatedAt: true,
			},
		}
	)
);

export const SubscribedTo = createMongoDBModel(
	"SubscribedTo",
	new Schema(
		{
			subscription: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Subscription",
			},
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
			subscribedTo: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Creator",
			},
			tx: {
				type: Schema.Types.ObjectId,
				required: true,
			},
		},
		{
			timestamps: {
				createdAt: true,
				updatedAt: true,
			},
		}
	)
);

export const LikePost = createMongoDBModel(
	"LikePost",
	new Schema(
		{
			postId: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Post",
			},
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
		},
		{
			timestamps: {
				createdAt: true,
				updatedAt: true,
			},
		}
	)
);

export const LikeNFT = createMongoDBModel(
	"LikeNFT",
	new Schema(
		{
			nftId: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "MarketplaceNFT",
			},
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
		},
		{
			timestamps: {
				createdAt: true,
				updatedAt: true,
			},
		}
	)
);

export const BlockProfile = createMongoDBModel(
	"BlockProfile",
	new Schema(
		{
			actor: {
				type: String,
				required: Schema.Types.ObjectId,
				ref: "Profile",
			},
			blockedProfile: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
		},
		{
			timestamps: {
				createdAt: true,
				updatedAt: true,
			},
		}
	)
);

export const FollowTag = createMongoDBModel(
	"ProfileInterests",
	new Schema(
		{
			tag: {
				type: String,
				required: true,
			},
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Profile",
			},
		},
		{
			timestamps: {
				createdAt: true,
				updatedAt: true,
			},
		}
	)
);

export const Collection = createMongoDBModel(
	"NFTCollection",
	new Schema(
		{
			name: {
				type: String,
				required: true,
			},
			creator: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: "Creator",
			},
			cover_image: {
				type: String,
			},
			nfts: [
				{
					type: Schema.Types.ObjectId,
					ref: "MarketplaceNFT",
				},
			],
			isSubscription: {
				type: Boolean,
				default: false,
			},
		},
		{
			timestamps: {
				createdAt: true,
				updatedAt: true,
			},
		}
	)
);
