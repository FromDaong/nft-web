import {returnWithSuccess} from "@db/engine/utils";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {MongoModelEvent} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {seller, id, price} = req.body;

	const nftEvent = new MongoModelEvent({
		id: Number(id),
		seller: seller.toLowerCase(),
		price: Number(price),
	});

	await nftEvent.save();

	return returnWithSuccess(nftEvent, res);
};

export default handler;
