import NFT from "../../../db/models/NFT";
import dbConnect from "../../../utils/dbConnect";
import { mapNftBody } from "./mappers";
import withSession from "../../../lib/session";

dbConnect();

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        // const user = await req.session.get("user");
        // if (!user) {
        //   return res.status(403);
        // }

        if (!req.body.master_password || req.body.master_password !== "lmao")
          res.status(400).json({ success: false, error: "invalid pass" });

        // const nftBody = mapNftBody(req.body);

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

        const newNFT = await NFT.create(nftBody);

        res.status(200).json({ success: true, newNFT });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});