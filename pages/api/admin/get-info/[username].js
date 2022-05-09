/* eslint-disable no-case-declarations */
import Model from "../../../../models/Model";
import dbConnect from "../../../../utils/dbConnect";
import withSession from "../../../../lib/session";

dbConnect();

const { PassbaseClient, PassbaseConfiguration } = require("@passbase/node");

const apiKey =
  "elBBJ5uEoadUIO99IwEKpmg3IvpzUz74UdSaxMMYcnJqYf1XRYpDlzXMXOMYMBeZrIVrC97SX0dE5GS0otGvZJ9OplGZXZKhqjGB0MctCFA5lmteuK1fzsH1Kkk405we";
const config = new PassbaseConfiguration({
  apiKey,
});
const client = new PassbaseClient(config);

export default withSession(async (req, res) => {
  const {
    query: { username },
    method,
  } = req;

  switch (method) {
    case "GET":
      const user = await req.session.get("admin");
      let modelRes = await Model.findOne({ username });

      if (!user) return res.status(400).json({ success: false });

      if (!modelRes)
        return res
          .status(400)
          .json({ success: false, error: "model not found" });

      if (modelRes.identity_access_key) {
        client
          .getIdentityById(modelRes.identity_access_key)
          .then((identity) => {
            const returnData = { ...modelRes.toObject(), identity };
            res.status(200).json(returnData);
          })
          .catch((e) => {
            const returnData = { ...modelRes.toObject(), identity: null };
            res.status(200).json(returnData);
          });
      } else {
        const returnData = { ...modelRes.toObject(), identity: null };
        res.status(200).json(returnData);
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
