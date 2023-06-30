import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelNFT, MongoModelProfile} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const user = await MongoModelProfile.findOne({
			username: req.query.username,
		});

		if (!user) {
			return res.status(404).json({message: "User not found"});
		}

		let posts = await MongoModelNFT.find({
			createdBy: {$in: user.following},
		})
			.sort("-createdAt")
			.exec();

		// Calculate the score for each post
		posts = posts.map((post) => {
			const hoursSinceLastActivity =
				(new Date().getTime() - post.createdAt.getTime()) / 1000 / 60 / 60;
			post.score = post.likes * 2 + post.views - hoursSinceLastActivity;
			return post;
		});

		// Sort the posts by score
		posts.sort((a, b) => b.score - a.score);

		res.json(posts.slice(0, 24));
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}
