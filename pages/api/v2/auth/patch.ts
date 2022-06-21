import Model from "../../../../db/models/Model";
import dbConnect from "../../../../utils/dbConnect";
import { withJWTAuth } from "./../../../../utils/server-utils";

dbConnect();

const patch = async (req, res) => {
  const { ethAddress } = req.session;
  try {
    let model = await Model.findOne({
      address: `${ethAddress}`.toLowerCase(),
    });
    let new_acc = false;

    if (!model) {
      new_acc = true;
      model = {};
    }

    if (!req.body) {
      return res
        .status(400)
        .json({ success: false, error: "please send req body" });
    }

    if (req.body.display_name) model.display_name = req.body.display_name;
    if (req.body.username) model.username = req.body.username;
    if (req.body.bio) model.bio = req.body.bio;
    if (req.body.social_account) model.social_account = req.body.social_account;
    if (req.body.profile_pic) model.profile_pic = req.body.profile_pic;
    if (req.body.banner_pic) model.banner_pic = req.body.banner_pic;
    if (req.body.email) model.email = req.body.email;
    if (req.body.identity_access_key)
      model.identity_access_key = req.body.identity_access_key;

    // Subscription description
    if (req.body.subscription_description) {
      if (model.subscription)
        model.subscription.description = req.body.subscription_description;
      else
        model.subscription = {
          description: req.body.subscription_description,
        };
    }
    if (new_acc) {
      await new Model(model).save();
    } else {
      await model.save();
    }

    res.status(200).json({ success: true, model });
  } catch (error) {
    console.error({ error });
    res.status(400).json({ success: false, error: error });
  }
};

export default withJWTAuth(patch);
