import {
	CollectionSearchManager,
	NFTSearchManager,
	PeopleSearchManager,
} from "@utils/search";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import { connectMongoDB } from "server/helpers/core";
import {returnWithSuccess} from "server/helpers/core/utils";
import {
	MongoModelCollection,
	MongoModelNFT,
	MongoModelProfile,
} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB()
	const {q} = req.query;

	if (!q) {
		return returnWithSuccess({people: []}, res);
	}

	const collections = await MongoModelCollection.find()
		.populate({
			path: "creator",
			populate: "profile",
		})
		.exec();
	const collectionSearchManager = new CollectionSearchManager(collections);
	collectionSearchManager.hydrate();
	const matched_collection_ids = await collectionSearchManager.search(
		q as string
	);
	const collection_results = collections.filter((collection) =>
		matched_collection_ids.includes(collection._id)
	);

	const profiles = await MongoModelProfile.find().exec();
	const peopleSearchManager = new PeopleSearchManager(profiles);
	peopleSearchManager.hydrate();
	const matched_ids = await peopleSearchManager.search(q as string);
	const search_results = profiles.filter((profile) =>
		matched_ids.includes(profile._id)
	);

	const nfts = await MongoModelNFT.find().populate("creator").exec();
	const nftSearchManager = new NFTSearchManager(nfts);
	nftSearchManager.hydrate();
	const matched_nft_ids = await nftSearchManager.search(q as string);
	const nft_results = nfts.filter((nft) => matched_nft_ids.includes(nft._id));

	return returnWithSuccess(
		{
			people: search_results,
			collections: collection_results,
			nfts: nft_results,
		},
		res
	);
}
