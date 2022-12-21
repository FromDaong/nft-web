import {
	populateNFTsWithProfileAndTx,
	returnWithError,
	returnWithSuccess,
} from "@db/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {connectMongoDB} from "server/helpers/core";
import {
	MongoModelCollection,
	MongoModelCreator,
	MongoModelNFT,
} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();

	const {collection_id} = req.query;
	const {page} = req.query;
	const get_page = Number(page ?? 1) || 1;
	const options = {
		page: get_page,
		limit: 24,
	};

	const collection = await MongoModelCollection.findOne({
		_id: collection_id,
	})
		.populate("creator")
		.exec();

	if (!collection) {
		return returnWithError("Collection not found", 404, res);
	}

	// @ts-ignore
	const nfts = await MongoModelNFT.paginate(
		{
			_id: {
				$in: collection.nfts,
			},
		},
		options
	);

	console.log({nfts, collection});

	nfts.docs = await MongoModelNFT.populate(nfts.docs, {
		path: "creator",
		model: MongoModelCreator,
	});

	return returnWithSuccess(nfts, res);
}
