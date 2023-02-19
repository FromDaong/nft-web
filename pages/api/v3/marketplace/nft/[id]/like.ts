import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {MongoModelNFT, MongoModelProfile} from "server/helpers/models";
import {withIronSessionApiRoute} from "iron-session/next";
import {ironOptions} from "@utils/index";
import {protectedAPIRoute} from "server/utils";

async function create(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();

	const {id} = req.query;
	const {session} = req;

	const profile = await MongoModelProfile.findOne({
		address: session.address.toLowerCase(),
	}).exec();

	const nft = await MongoModelNFT.findOne({
		id,
	}).exec();

	if (!nft) {
		return returnWithError("Post not found", 404, res);
	}

	if (nft.likedBy && nft.likedBy.includes(profile._id)) {
		await MongoModelNFT.findByIdAndUpdate(nft._id, {
			$pull: {
				likedBy: profile._id,
			},
		});
	} else {
		await MongoModelNFT.findByIdAndUpdate(nft._id, {
			$push: {
				likedBy: profile._id,
			},
		});
	}

	return returnWithSuccess(nft, res);
}

export default protectedAPIRoute(create);
