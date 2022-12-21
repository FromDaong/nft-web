import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {protectedAPIRoute} from "server/utils";
import {
	MongoModelCollection,
	MongoModelCreator,
	MongoModelNFT,
	MongoModelProfile,
} from "server/helpers/models";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();
	const {session} = req;
	const {method} = req;
	const {collection, nfts, hash} = req.body;

	if (method !== "POST") return returnWithError("Method not allowed", 405, res);
	if (!collection) return returnWithError("Collection is required", 401, res);
	if (!nfts) return returnWithError("NFTs are required", 401, res);

	const creator = await MongoModelCreator.findOne({
		address: session.address.toLowerCase(),
	});

	if (!creator) return returnWithError("Creator profile is required", 401, res);

	const collection_id = collection._id;

	try {
		const created_nfts = await Promise.all(
			nfts.map(async (nft) => {
				const mongoNFT = new MongoModelNFT({
					id: parseInt(nft.id),
					tx_hash: hash,
					name: nft.name,
					description: nft.description,
					price: nft.price,
					external_url: process.env.NFT_EXTERNAL_URL,
					image: {
						cdn: nft.cdn,
						ipfs: nft.ipfs,
					},
					max_supply: parseInt(nft.maxSupply),
					protected: nft.protected,
					type: nft.type,
					creator: creator._id,
					collection: collection_id,
					subscription_nft: nft.subscription_nft,
				});

				await mongoNFT.save();

				return mongoNFT._id;
			})
		);

		await MongoModelCollection.findByIdAndUpdate(collection_id, {
			nfts: created_nfts,
		});

		return returnWithSuccess(
			{
				message: "NFTs created successfully",
			},
			res
		);
	} catch (err) {
		console.log({err});
		return returnWithError(err.toString(), 500, res);
	}
}

export default protectedAPIRoute(handler);
