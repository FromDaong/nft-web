import {MongoModelProfile} from "server/helpers/models";
import {calculateBioSimilarity} from "./natural";

interface Profile {
	_id: string;
	bio: string;
	following: string[];
	[key: string]: any;
}

function calculateFollowingSimilarity(user1: Profile, user2: Profile): number {
	// This is a simple example where we just count the number of common users they follow
	const commonFollowings = user1.following?.filter((user) =>
		user2.following?.includes(user)
	);
	return commonFollowings.length;
}

export async function getWhomToFollowForProfile(
	userId: string
): Promise<Profile[]> {
	// Get the user for whom we want recommendations
	const user = await MongoModelProfile.findOne({_id: userId}).lean().exec();
	if (!user) {
		throw new Error("User not found");
	}

	const following = user.following.map((_) => _._id.toString());

	// Get all other users
	const otherUsers = await MongoModelProfile.find({
		$and: [{_id: {$ne: user._id}}, {_id: {$nin: following}}],
	})
		.lean()
		.exec();

	// Calculate similarity scores
	const scores = await Promise.all(
		otherUsers.map(async (otherUser) => {
			const bioSimilarity = await calculateBioSimilarity(user, otherUser);
			const followingSimilarity = calculateFollowingSimilarity(
				user,
				otherUser as Profile
			);
			const totalSimilarity = bioSimilarity + followingSimilarity;
			return {user: otherUser as Profile, score: totalSimilarity};
		})
	);

	// Sort by score and take the top 5
	const top5 = scores.sort((a, b) => b.score - a.score).slice(0, 5);

	// Return the recommended users
	return top5.map((item) => item.user);
}

export async function getSimilarProfiles(
	userId: string,
	exclude: string[]
): Promise<Profile[]> {
	// Get the user for whom we want recommendations
	const user = await MongoModelProfile.findOne({_id: userId}).lean().exec();
	if (!user) {
		throw new Error("User not found");
	}

	// Get all other users
	const otherUsers = await MongoModelProfile.find({
		$and: [{_id: {$ne: user._id}}, {_id: {$nin: exclude}}],
	})
		.lean()
		.exec();

	// Calculate similarity scores
	const scores = await Promise.all(
		otherUsers.map(async (otherUser) => {
			const bioSimilarity = await calculateBioSimilarity(user, otherUser);
			const followingSimilarity = calculateFollowingSimilarity(
				user,
				otherUser as Profile
			);
			const totalSimilarity = bioSimilarity + followingSimilarity;
			return {user: otherUser as Profile, score: totalSimilarity};
		})
	);

	// Sort by score and take the top 5
	const top5 = scores.sort((a, b) => b.score - a.score).slice(0, 5);

	// Return the recommended users
	return top5.map((item) => item.user);
}
