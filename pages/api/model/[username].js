import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";
import Web3 from "web3";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";

dbConnect();

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
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
        delete returnData.model_bnb_address;
        delete returnData.identity_access_key;

        res.status(200).json(returnData);
      } catch (error) {
        console.error({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "PUT":
      try {
        let model = await Model.findOne({ username });

        if (!model)
          return res
            .status(400)
            .json({ success: false, error: "model not found" });

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

        

        model.save();

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
