import Model from "../../../db/models/Model";
import dbConnect from "../../../utils/dbConnect";
import withSession from "../../../lib/session";
import { withJWTAuth } from "../../../utils/server-utils";

dbConnect();

export default withJWTAuth(async (req, res) => {
  const { method } = req;
  const { ethAddress } = req.session;

  switch (method) {
    case "POST":
      try {
        const nftBody = {
          username: req.body.username,
          model_bnb_address: req.body.address,
          address: req.body.address,
          referrer_address: req.body.referrer_address,
          bio: req.body.bio,
          social_account: req.body.social_account,
          profile_pic: req.body.profile_pic,
          email: req.body.email,
          identity_access_key: req.body.identity_access_key,
          nfts: [],
          pending: true,
          rejected: false,
          isModel: req.body.isModel,
        };

        // const identity = await client.getIdentityById("identity_access_key");

        const newModel = await Model.findOneAndUpdate(
          {
            address: `${ethAddress}`.toLowerCase(),
          },
          { ...nftBody },
          { new: true }
        );

        console.log({ newModel, ethAddress });

        if (req.body.referrer_address) {
          const referrer = await Model.findOne({
            address: req.body.referrer_address,
          });

          if (!referrer.reffered) {
            referrer.referred = [];
          }

          referrer.referred.push(req.body.address);
          referrer.save();
        }

        res.status(200).json({ success: true, newNFT: newModel });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});