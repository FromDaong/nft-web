import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";
import withSession from "../../../lib/session";

dbConnect();

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const user = await req.session.get("admin");

        if (!user) return res.status(400).json({ success: false });

        const pendingModels = await Model.find({ pending: true });
        const rejectedModels = await Model.find({ rejected: true });
        const acceptedModels = await Model.find({
          pending: false,
          rejected: false,
        });

        res.status(200).json({ pendingModels, rejectedModels, acceptedModels });
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
