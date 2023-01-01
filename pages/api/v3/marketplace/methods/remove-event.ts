import {returnWithSuccess} from "@db/engine/utils";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import {MongoModelEvent} from "server/helpers/models";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {seller, id} = req.body;

	const nftEvent = await MongoModelEvent.findOneAndDelete({
		id: Number(id),
		seller: seller.toLowerCase(),
	});

	return returnWithSuccess(nftEvent, res);
};

export default handler;
