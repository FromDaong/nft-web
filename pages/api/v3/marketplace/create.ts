import {connectMongoDB} from "server/database/engine";
import {NextApiResponse} from "next";
import {NextApiRequest} from "next";
import LegacyCreatorModel from "@db/legacy/profile/Creator";
import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {returnWithSuccess} from "server/database/engine/utils";

export default async function Create(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await connectMongoDB();
	const {method} = req.query;

	if (method === "POST") {
		try {
			if (!req.body.master_password || req.body.master_password !== "lmao")
				res.status(400).json({success: false, error: "invalid pass"});

			const nftBody = {
				id: req.body.id,
				list_price: req.body.list_price,
				name: req.body.name,
				description: req.body.description,
				external_url: req.body.external_url,
				image: req.body.image,
				model_handle: req.body.model_handle,
				max_supply: req.body.max_supply,
				model_bnb_address: req.body.model_bnb_address,
				blurhash: req.body.blurhash,
				model_profile_pic: req.body.model_profile_pic,
				attributes: [
					{
						trait_type: "Model",
						value: req.body.model_handle,
					},
					{
						trait_type: "Max Supply",
						value: req.body.max_supply,
					},
				],
			};
			const newNFT = await LegacyNFTModel.create(nftBody);
			res.status(200).json({success: true, newNFT});
		} catch (error) {
			res.status(400).json({success: false, error: error});
		}
	} else {
		res.status(400).json({success: false});
	}
}
