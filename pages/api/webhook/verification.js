import Model from "@models/Model";
import dbConnect from "@utils/dbConnect";
import withSession from "@lib/session";

dbConnect();

export default withSession(async (req, res) => {
  const {
    query: { username },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        if (
          req.body.event === "VERIFICATION_REVIEWED" &&
          req.body.status === "approved"
        ) {
          let modelRes = await Model.updateOne(
            { identity_access_key: req.body.key },
            { $set: { pending: false, rejected: false } }
          );

          if (!modelRes)
            return res
              .status(400)
              .json({ success: false, error: "model not found" });

          const returnData = { ...modelRes };

          res.status(200).json(returnData);
        } else {
          res.status(200);
        }
      } catch (error) {
        console.error({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
