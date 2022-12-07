import {Schema} from "mongoose";
import createMongoDBModel from "server/database/engine/utils";

export const FollowRelationship = createMongoDBModel(
	"FollowRelationship",
	new Schema(
		{
			actor: {
				type: Schema.Types.ObjectId,
				required: true,
			},
			followedProfile: {
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

export const SubscribeRelationship = createMongoDBModel(
	"SubscribeRelationship",
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
			subscriptionCreator: {
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
