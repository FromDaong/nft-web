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
		address: session.user.address.toLowerCase(),
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
	});

	const tx = new MongoModelTransaction({
		txHash: payload.txHash,
		metadata: {
			nftId: payload.nftId,
			balanceSender: profile.address.toLowerCase(),
			balanceReceiver: payload.seller.toLowerCase(),
		},
		type: "nft_purchase",
		amount: payload.price,
		timestamp: payload.timestamp,
	});

	const event = new MongoModelTimelineEvent({
		profile: profile._id,
		action: {
			verb: ["purchased NFT ", `$1`, `for ${payload.price} from`, `$2`],
			subjects: [nft.name, payload.seller.toLowerCase()],
		},
	});

	if (payload.remaining === 0) {
		await MongoModelEvent.findOneAndDelete({
			id: payload.nftId,
			seller: payload.seller.toLowerCase(),
		});
	}

	await Promise.all([tx.save(), event.save()]);

	return returnWithSuccess(tx, res);
}

export default protectedAPIRoute(handler);
