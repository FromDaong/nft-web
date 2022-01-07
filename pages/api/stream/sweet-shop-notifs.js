import dbConnect from "../../../utils/dbConnect";
import PendingNFT from "../../../models/PendingNFT";
import NFT from "../../../models/NFT";
import Model from "../../../models/Model";
import withSession from "../../../lib/session";
const sgClient = require("@sendgrid/mail");

import Web3 from "web3";

dbConnect();

sgClient.setApiKey(process.env.SENDGRID_API_KEY);

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "POST":
      try {
        if (req.body.status !== "confirmed") return res.status(200);
        console.log("New sale", req.body);

        const nftId =
          (req.body.contractCall &&
            req.body.contractCall.params &&
            req.body.contractCall.params.nftId) ||
          (req.body.contractCall &&
            req.body.contractCall.params &&
            req.body.contractCall.params._nft);

        if (!nftId)
          return res.status(400).json({ success: false, error: "no nft id" });

        console.log({ nftId }, "New Sale");
        const nftData = await NFT.findOne({ id: nftId });

        if (!nftData)
          return res.status(400).json({ success: false, error: "no nft data" });

        const modelData = await Model.findOne({
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
          res.status(200).json({ success: true });
        } catch (e) {
          console.error(e);
          res.status(500).json({ success: false });
        }
      } catch (error) {
        console.log({ error });
        res.status(200).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
