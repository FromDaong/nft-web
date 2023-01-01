import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {
	MongoModelEvent,
	MongoModelNFT,
	MongoModelProfile,
	MongoModelTimelineEvent,
	MongoModelTransaction,
} from "server/helpers/models";
import {protectedAPIRoute} from "server/utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();

	const {body} = req;
	const {session} = req;

	const profile = await MongoModelProfile.findOne({
		address: session.address.toLowerCase(),
	});

	if (!profile) return returnWithError("Not authorized", 403, res);

	const payload = {
		txHash: body.tx_hash,
		seller: body.seller,
		nftId: body.nftId,
		price: body.price,
		timestamp: body.timestamp ?? new Date().getTime(),
		nft_type: body.nft_type,
		remaining: body.remaining,
	};

	const nft = await MongoModelNFT.findOne({
		id: payload.nftId,
	}).populate("creator");

	const event = new MongoModelTimelineEvent({
		profile: profile._id,
		action: {
			verb: ["purchased NFT ", `$1`, `for ${payload.price} from`, `$2`],
			subjects: [
				nft.name,
				payload.seller ? payload.seller.toLowerCase() : nft.creator.address,
			],
		},
	});

	if (payload.remaining === 0) {
		await MongoModelEvent.findOneAndDelete({
			id: payload.nftId,
			seller: payload.seller
				? payload.seller.toLowerCase()
				: nft.creator.address,
		});
	}

	await Promise.all([event.save()]);

	return returnWithSuccess(event, res);
}

export default protectedAPIRoute(handler);
