import {returnWithError} from "server/database/engine/utils";
import {connectMongoDB} from "server/database/engine";
import Web3 from "web3";

import LegacyNFTModel from "server/database/legacy/nft/NFT";
import {MongoModelCreator} from "server/helpers/models";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";

import TreatNFTMinterABI from "packages/treat/lib/abi/treatnftminter.json";

const web3 = new Web3(process.env.RPC_NODE_URL);

const treatNFTMinter = new web3.eth.Contract(
	TreatNFTMinterABI as any,
	contractAddresses.treatNFTMinter[56]
);

export default async function handler(req, res) {
	await connectMongoDB();
	const {id} = req.query;

	if (!id) {
		return returnWithError("No ID provided", 400, res);
	}

	try {
		if (!req.body.address || !req.body.nfts)
			return res.status(400).json({success: false, error: "missing params"});

		const isPerformer = await treatNFTMinter.methods
			.isPerformer(req.body.address)
			.call();

		if (!isPerformer)
			return res.status(400).json({success: false, error: "no permission"});

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
					subscription_nft: true,
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

				try {
					// T-63 Update from Legacy NFT
					const newNFT = await LegacyNFTModel.create(nftBody);
					await MongoModelCreator.updateOne(
						{address: nft.model_bnb_address},
						{
							$push: {
								sub_nfts: {
									id: nft.id,
								},
							},
						},
						{
							_id: false,
						}
					);
					return newNFT;
				} catch (e) {
					return;
				}
			})
		);

		res.status(200).json({success: true, newNFTs});
	} catch (error) {
		res.status(400).json({success: false, error: error});
	}
}
