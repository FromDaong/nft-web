import {
	CollectionSearchManager,
	NFTSearchManager,
	PeopleSearchManager,
} from "@utils/search";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {connectMongoDB} from "server/helpers/core";
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
	await connectMongoDB();
	const {q} = req.query;

	if (!q) {
		return returnWithSuccess({people: []}, res);
	}

	const profiles = await MongoModelProfile.find().exec();
	const peopleSearchManager = new PeopleSearchManager(profiles);
	peopleSearchManager.hydrate();
	const matched_ids = await peopleSearchManager.search(q as string);
	const search_results = profiles.filter((profile) =>
		matched_ids.includes(profile._id)
	);

	const nfts = await MongoModelNFT.find()
		.populate({
			path: "creator",
			populate: "profile",
		})
		.exec();
	const nftSearchManager = new NFTSearchManager(nfts);
	nftSearchManager.hydrate();
	const matched_nft_ids = await nftSearchManager.search(q as string);
	const nft_results = nfts.filter((nft) => matched_nft_ids.includes(nft.id));

	return returnWithSuccess(
		{
			people: search_results.slice(0, 24),
			nfts: nft_results.slice(0, 24),
		},
		res
	);
}
