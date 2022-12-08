import {Schema} from "mongoose";
import createMongoDBModel from "server/database/engine/utils";

export const Followers = createMongoDBModel(
	"Follower",
	new Schema(
		{
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			followedBy: {
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

export const Following = createMongoDBModel(
	"Following",
	new Schema(
		{
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			following: {
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

export const SubscriberBy = createMongoDBModel(
	"Subscriber",
	new Schema(
		{
			subscriptionId: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			subscribedBy: {
				type: Schema.Types.ObjectId,
				required: true,
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
	"Subscribed",
	new Schema(
		{
			subscriptionId: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			subscribedTo: {
				type: Schema.Types.ObjectId,
				required: true,
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
			},
			actor: {
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

export const LikeNFT = createMongoDBModel(
	"LikeNFT",
	new Schema(
		{
			nftId: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			actor: {
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

export const BlockProfile = createMongoDBModel(
	"BlockProfile",
	new Schema(
		{
			actor: {
				type: String,
				required: Schema.Types.ObjectId,
			},
			blockedProfile: {
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

export const FollowTag = createMongoDBModel(
	"FollowTag",
	new Schema(
		{
			tag: {
				type: String,
				required: true,
			},
			actor: {
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
