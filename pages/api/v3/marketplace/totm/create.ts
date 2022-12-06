import {connectMongoDB} from "@db/engine";
import LegacyNFTModel from "@db/legacy/nft/NFT";
import LegacyCreatorModel from "@db/legacy/profile/Creator";
import {
	enforcePrivacyForNFTs,
	returnWithError,
	returnWithSuccess,
} from "@db/engine/utils";

export default async function handler(req, res) {
	await connectMongoDB();

	try {
		const user = await req.session.get("admin");

		if (!req.body.address || !req.body.nfts || !user)
			return res.status(400).json({success: false, error: "missing params"});

		// TODO: Migrate from Legacy NFT Model to new NFT Model
		const newNFTs = await Promise.all(
			req.body.nfts.map(async (nft) => {
				const nftBody = {
					id: Number(nft.id),
					list_price: nft.list_price,
					name: nft.name,
					description: nft.description,
					external_url: nft.external_url,
					image: nft.image,
					model_handle: nft.model_handle,
					max_supply: nft.max_supply,
					model_bnb_address: nft.model_bnb_address,
					blurhash: nft.blurhash,
					model_profile_pic: nft.model_profile_pic,
					totm: true,
					old_totm: true,
					attributes: [
						{
							trait_type: "Model",
							value: nft.model_handle,
						},
						{
							trait_type: "Max Supply",
							value: nft.max_supply,
						},
					],
				};

				const newNFT = await LegacyNFTModel.create(nftBody);
				await LegacyCreatorModel.updateOne(
					{address: nft.model_bnb_address},
					{
						$push: {
							nfts: {
								id: nft.id,
							},
						},
					},
					{
						_id: false,
					}
				);
				return newNFT;
			})
		);

		returnWithSuccess(enforcePrivacyForNFTs(newNFTs), res);
	} catch (error) {
		returnWithError("Error creating NFT", 400, res);
	}
}
