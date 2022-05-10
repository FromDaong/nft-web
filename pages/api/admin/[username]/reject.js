import Model from "../../../../db/models/Model";
import dbConnect from "../../../../utils/dbConnect";
import withSession from "../../../../lib/session";

dbConnect();

export default withSession(async (req, res) => {
  const {
    query: { username },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const user = await req.session.get("admin");

        if (!user) {
          return res.status(200).json({ failed: true });
        }

        let modelRes = await Model.updateOne(
          { username },
          { $set: { pending: false, rejected: true } }
        );

        if (!modelRes)
          return res
            .status(400)
            .json({ success: false, error: "model not found" });

        const returnData = { ...modelRes };

        res.status(200).json(returnData);
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
