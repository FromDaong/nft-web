// Get nfts listed for resale from blockchain for the given address

import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {
	enforcePrivacyForNFTs,
	returnWithSuccess,
} from "server/database/engine/utils";
import {MongoModelCreator} from "server/helpers/models";
import {MongoModelNFT} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {page, username} = req.query;

	const get_page = Number(page ?? 1) || 1;
	const options = {
		page: get_page,
		limit: 24,
	};

	if (!username) {
		return res.status(400).json({error: "No username provided"});
	}

	const creator = await MongoModelCreator.findOne({username});

	console.log({username, creator});

	if (!creator) {
		return res.status(404).json({error: "Creator not found"});
	}

	// @ts-ignore
	const creatorNFTs = await MongoModelNFT.paginate(
		{
			creator: creator._id,
		},
		options
	);

	creatorNFTs.docs = await MongoModelNFT.populate(creatorNFTs.docs, {
		path: "creator",
		model: MongoModelCreator,
	});

	return returnWithSuccess(creatorNFTs, res);
}
