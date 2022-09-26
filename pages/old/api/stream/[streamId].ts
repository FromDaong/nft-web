import axios from "axios";
import Model from "@models/Model";
import Ban from "@models/privacy/Ban";

/**
 * calls the /stream/<id> route of Livepeer.com APIs to get the stream's status to verify that the stream is live or not.
 * isActive: true means video segments are currently being ingested by Livepeer.com. isActive: false means the live stream is idle and no
 * video segments are currently being ingested by Livepeer.com.
 */
export default async (req, res) => {
  if (req.method === "GET") {
    const streamId = req.query.streamId;
    try {
      const streamStatusResponse = await axios.get(
        `https://livepeer.com/api/stream/${streamId}`,
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${"06b4bf90-1f97-4175-9295-8bf72642ef8a"}`, // API Key needs to be passed as a header
          },
        }
      );

      if (streamStatusResponse && streamStatusResponse.data) {
        const model = await Model.findOne({ "live.stream_id": streamId });
        const banned = await Ban.find({ channel: model.live.playback_id });
        res.statusCode = 200;
        res.json({ ...streamStatusResponse.data, banned: [...banned] });
      } else {
        res.statusCode = 500;
        res.json({ error: "Something went wrong" });
      }
    } catch (error) {
      res.statusCode = 500;
      console.log({ error });
      res.json({ error });
    }
  }
};