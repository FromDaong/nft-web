import { withJWTAuth } from "../../../../utils/server-utils";

async function patch(req, res) {
  const { action } = req.body;
  if (action === "delete") {
    res.status(200).json([]);
  } else {
    res.status(500).json({ error: "Unknown action" });
  }
  // Pull and delete all notifications older than 24 hrs except for tips
}

export default withJWTAuth(patch);
