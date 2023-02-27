import {returnWithError} from "@db/engine/utils";
import {NextApiResponse} from "next";
import {connectMongoDB} from "server/helpers/core";
import {MongoModelNFT} from "server/helpers/models";

export default async function image(req, res: NextApiResponse) {
	const {_id, content_type} = req.query;
	const content_types = ["nft", "creator"];

	if (!content_types.includes(content_type)) {
		return returnWithError("Not found", 404, res);
	}

	await connectMongoDB();

	if (content_type === "nft") {
		const nft = await MongoModelNFT.findById(_id);

		return res.redirect(nft.image.ipfs);
	}

	return res.status(400).send("not found");
}
