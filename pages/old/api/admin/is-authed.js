import Model from "../../../db/models/Model";
import dbConnect from "../../../utils/dbConnect";
import withSession from "../../../lib/session";

dbConnect();

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const user = await req.session.get("admin");

        if (!user) {
          return res.status(200).json({ failed: true });
        } else {
          return res.status(200).json({ success: true });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
