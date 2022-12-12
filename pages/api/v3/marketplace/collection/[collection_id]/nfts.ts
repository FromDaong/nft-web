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

	const collection = await MongoModelCollection.findOne({
		_id: collection_id,
	}).populate("creator");

	if (!collection) {
		return returnWithError("Collection not found", 404, res);
	}

	const collectionNfts = collection.toObject().nfts;

	const nfts = await MongoModelNFT.find({
		_id: {$in: collectionNfts},
	}).populate({
		path: "creator",
		select: "username address bio profile",
		model: MongoModelCreator,
	});

	return returnWithSuccess(
		{
			collection: collection,
			nfts: await populateNFTsWithProfileAndTx(nfts),
		},
		res
	);
}
