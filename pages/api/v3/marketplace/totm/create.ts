import TreatNFTMinterABI from "packages/treat/lib/abi/treatnftminter.json";

import web3 from "@utils/web3";
import {contractAddresses} from "@packages/treat/lib/constants";
import {connectMongoDB} from "server/helpers/core";
import {withIronSessionApiRoute} from "iron-session/next";
import {ironOptions} from "@utils/index";
import {MongoModelCreator, MongoModelNFT} from "server/helpers/models";

const treatNFTMinter = new web3.eth.Contract(
	TreatNFTMinterABI as any,
	contractAddresses.treatNFTMinter[56]
);

export default withIronSessionApiRoute(async (req, res) => {
	const {method} = req;

	await connectMongoDB();

	switch (method) {
		case "POST":
			try {
				const user = await req.session.get("admin");

				if (!req.body.address || !req.body.nfts || !user)
					return res
						.status(400)
						.json({success: false, error: "missing params"});

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

						const newNFT = await MongoModelNFT.create(nftBody);
						await MongoModelCreator.updateOne(
							{address: nft.model_bnb_addres.toLowerCase()},
							{
								$push: {
									nfts: {
										id: nft.id,
									},
								},
							}
						);
						return newNFT;
					})
				);

				res.status(200).json({success: true, newNFTs});
			} catch (error) {
				res.status(400).json({success: false, error: error});
			}
			break;
		default:
			res.status(400).json({success: false});
			break;
	}
}, ironOptions);
