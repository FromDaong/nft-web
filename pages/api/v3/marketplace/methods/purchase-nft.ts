import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {
	MongoModelCreator,
	MongoModelNFT,
	MongoModelProfile,
} from "server/helpers/models";
import {protectedAPIRoute} from "server/utils";

const sendgridClient = require("@sendgrid/mail");
sendgridClient.setApiKey(process.env.SENDGRID_API_KEY);

async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();

	const {body} = req;
	const {session} = req;

	const profile = await MongoModelProfile.findOne({
		address: session.address.toLowerCase(),
	});

	if (!profile) return returnWithError("Not authorized", 403, res);
	if (!profile.email) return returnWithSuccess("Email not set", res);

	const payload = {
		txHash: body.tx_hash,
		seller: body.seller,
		nftId: body.nftId,
		price: body.price,
		timestamp: body.timestamp ?? new Date().getTime(),
		// nft_type: body.nft_type,
		// remaining: body.remaining,
	};

	const nft = await MongoModelNFT.findOne({
		id: payload.nftId,
	}).populate("creator");

	const creator = await MongoModelCreator.findById(nft.creator).populate(
		"profile"
	);
	const msg = {
		to: creator.profile.email,
		from: {
			email: "noreply@treatdao.com",
			name: "Treat DAO",
		},
		templateId: "d-d5da0ec9d69f43db8e8001dbc280e47a",
		dynamicTemplateData: {
			nft_name: nft.name,
			nft_price: nft.price,
			nft_url: `https://treatdao.com/post/nft/${nft._id}`,
		},
	};

	try {
		const sgClientResponse = await sendgridClient.send(msg);
		console.log("email sent", sgClientResponse);
	} catch (e) {
		console.error({e});
	}

	return returnWithSuccess({email_sent: true}, res);
}

export default protectedAPIRoute(handler);
