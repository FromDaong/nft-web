import {
	populateNFTsWithProfile,
	returnWithError,
} from "server/database/engine/utils";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {
	connectMongoDB,
	getFromRedisCache,
	setStringToRedisCache,
} from "server/database/engine";
import {returnWithSuccess} from "server/database/engine/utils";
import {MongoModelCreator, MongoModelNFT} from "server/helpers/models";

export default async function totm(req: NextApiRequest, res: NextApiResponse) {
	const cached_totm = await getFromRedisCache("totm");
	if (cached_totm) {
		return returnWithSuccess(cached_totm, res);
	}

	await connectMongoDB();
	const totm_model = await MongoModelCreator.findOne({"totm.current": true});

	if (!totm_model) {
		return returnWithError("No TOTM model found", 404, res);
	}
	const NFTs = await MongoModelNFT.find({
		creator: totm_model._id,
	})
		.populate({
			path: "creator",
			select: "username address bio profile",
			model: MongoModelCreator,
		})
		.limit(20);

	const nftsWithDp = await populateNFTsWithProfile(NFTs);

	await setStringToRedisCache("totm", nftsWithDp);

	return returnWithSuccess(nftsWithDp, res);
}
