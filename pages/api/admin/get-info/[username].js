import dbConnect from "../../../../utils/dbConnect";
import Model from "../../../../models/Model";
import withSession from "../../../../lib/session";

dbConnect();

const { PassbaseClient, PassbaseConfiguration } = require("@passbase/node");

const apiKey = // hidestream
  "OSjy4wqjZaKBi0hUf5dir2Y3hfc6LM0fNeUBzzIKCySelBvIjHkKsbak40J2kZvCF4v26w45OGipY0c1er7rkKa9lBJFKYG6Zl14Adf0uk7wEeQLIkS6TZtf33Dve3C4";
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

      if (!user) return res.status(400).json({ success: false });

      let modelRes = await Model.findOne({ username });

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
