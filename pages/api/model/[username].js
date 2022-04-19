import Model from "../../../models/Model";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import Web3 from "web3";
import dbConnect from "../../../utils/dbConnect";

dbConnect();

const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/0e4b710bbd818e9709fe0ef5/bsc/mainnet"
);

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  "0xde39d0b9a93dcd541c24e80c8361f362aab0f213"
);

export default async (req, res) => {
  const {
    query: { username },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let modelRes = await Model.findOne({ username });

        if (!modelRes)
          return res
            .status(400)
            .json({ success: false, error: "model not found" });

        const returnData = { ...modelRes.toObject() };
        res.status(200).json(returnData);
      } catch (error) {
        console.error({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "PUT":
      try {
        let model = await Model.findOne({ username });
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
        if (req.body.social_account)
          model.social_account = req.body.social_account;
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
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
