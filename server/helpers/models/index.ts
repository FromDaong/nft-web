import {
	LikePost,
	LikeNFT,
	BlockProfile,
	FollowTag as Interests,
	Collection,
} from "./graph/index";
import {Followers, Following, SubscribedBy, SubscribedTo} from "./graph";
import ModelCreator from "./users/creator";
import ModelProfile from "./users/profile";
import ModelSubscriptionPackage from "./users/subscription";
import ModelUser from "./users/user";
import NFTModel from "./nft";
import Post from "./posts";
import ModelTransaction from "./transaction";

export const MongoModelCreator = ModelCreator;
export const MongoModelProfile = ModelProfile;
export const MongoModelUser = ModelUser;
export const MongoModelSubscription = ModelSubscriptionPackage;
export const MongoModelFollower = Followers;
export const MongoModelFollowing = Following;
export const MongoModelSubscribedBy = SubscribedBy;
export const MongoModelSubscribedTo = SubscribedTo;
export const MongoModelLikePost = LikePost;
export const MongModelLikeNFT = LikeNFT;
export const MongoModelBlockProfile = BlockProfile;
export const MongoModelFollowingTag = Interests;
export const MongoModelNFT = NFTModel;
export const MongModelPost = Post;
export const MongoModelTransaction = ModelTransaction;
export const MongoModelCollection = Collection;
