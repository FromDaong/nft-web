import axios from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import {returnWithError} from "server/database/engine/utils";
import {returnWithSuccess} from "server/database/engine/utils";
import {connectMongoDB} from "server/database/engine";
import LegacyCreatorModel from "server/database/legacy/profile/Creator";
import Ban from "@db/legacy/privacy/Ban";
import LegacyNFTModel from "@db/legacy/nft/NFT";
const sgClient = require("@sendgrid/mail");

sgClient.setApiKey(process.env.SENDGRID_API_KEY);
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	connectMongoDB();

	if (req.method === "GET") {
		try {
			returnWithSuccess("", res);
		} catch (error) {
			return returnWithError(error.message, 400, res);
		}
	} else if (req.method === "POST") {
		try {
			if (req.body.status !== "confirmed") returnWithSuccess("", res);
			console.log("New sale", req.body);

			const nftId =
				(req.body.contractCall &&
					req.body.contractCall.params &&
					req.body.contractCall.params.nftId) ||
				(req.body.contractCall &&
					req.body.contractCall.params &&
					req.body.contractCall.params._nft);

			if (!nftId)
				return res.status(400).json({success: false, error: "no nft id"});

			console.log({nftId}, "New Sale");
			const nftData = await LegacyNFTModel.findOne({id: nftId});

			if (!nftData)
				return res.status(400).json({success: false, error: "no nft data"});

			const modelData = await LegacyNFTModel.findOne({
				address: nftData.model_bnb_address,
			});

			const msg = {
				to: modelData.email,
				from: {
					email: "noreply@treatdao.com",
					name: "Treat DAO",
				},
				templateId: "d-d5da0ec9d69f43db8e8001dbc280e47a",
				dynamicTemplateData: {
					nft_name: nftData.name,
					nft_price: nftData.list_price,
					nft_url: `https://treatdao.com/view/${nftId}`,
				},
			};

			console.log("attempting to send email");

			try {
				const sgClientResponse = await sgClient.send(msg);
				console.log("email sent", sgClientResponse);
				res.status(200).json({success: true});
			} catch (e) {
				console.error(e);
				res.status(500).json({success: false});
			}
		} catch (error) {
			return returnWithError(error.message, 400, res);
		}
	} else {
		return returnWithError("Failed", 405, res);
	}
}
