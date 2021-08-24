import dbConnect from "../../../../utils/dbConnect";
import Model from "../../../../models/Model";

dbConnect();

const { PassbaseClient, PassbaseConfiguration } = require("@passbase/node");

const apiKey =
  "OSjy4wqjZaKBi0hUf5dir2Y3hfc6LM0fNeUBzzIKCySelBvIjHkKsbak40J2kZvCF4v26w45OGipY0c1er7rkKa9lBJFKYG6Zl14Adf0uk7wEeQLIkS6TZtf33Dve3C4";
const config = new PassbaseConfiguration({
  apiKey,
});
const client = new PassbaseClient(config);

export default async (req, res) => {
  const {
    query: { username },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        let modelRes = await Model.findOne({ username });
        let identity;

        if (modelRes.identity_access_key)
          identity = await client.getIdentityById(modelRes.identity_access_key);

        if (!modelRes)
          return res
            .status(400)
            .json({ success: false, error: "model not found" });

        const returnData = { ...modelRes.toObject(), identity };

        res.status(200).json(returnData);
      } catch (error) {
        console.log({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
