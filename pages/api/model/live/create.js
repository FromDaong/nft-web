import Model from "../../../../db/models/Model";
import axios from "axios";
import { withJWTAuth } from "../../../../utils/server-utils";

/**
 * calls the /stream route of Livepeer.com APIs to create a new stream.
 * The response returns the playbackId and streamKey.
 * With this data available the ingest and playback urls would respectively be:
 * Ingest URL: rtmp://rtmp.livepeer.com/live/{stream-key}
 * Playback URL: https://cdn.livepeer.com/hls/{playbackId}/index.m3u8
 */
export default withJWTAuth(async (req, res) => {
  console.log(req.session);
  const { ethAddress } = req.session;
  // const authed = await req.session.get("authed");

  if (req.method === "GET") {
    try {
      const createStreamResponse = await axios.post(
        "https://livepeer.com/api/stream",
        {
          name: ethAddress,
          profiles: [
            {
              name: "720p",
              bitrate: 2000000,
              fps: 30,
              width: 1280,
              height: 720,
            },
            {
              name: "480p",
              bitrate: 1000000,
              fps: 30,
              width: 854,
              height: 480,
            },
            {
              name: "360p",
              bitrate: 500000,
              fps: 30,
              width: 640,
              height: 360,
            },
          ],
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${"06b4bf90-1f97-4175-9295-8bf72642ef8a"}`, // API Key needs to be passed as a header
          },
        }
      );

      if (createStreamResponse && createStreamResponse.data) {
        console.log({ ethAddress });
        await Model.updateOne(
          {
            address: ethAddress
          },
          {
            $set: {
              live: {
                stream_id: createStreamResponse.data.id,
                playback_id: createStreamResponse.data.playbackId,
                stream_key: createStreamResponse.data.streamKey,
              },
            },
          }
        );
        res.redirect("/dashboard?tab=subscription-livedash");
      } else {
        res.statusCode = 500;
        res.json({ error: "Something went wrong" });
      }
    } catch (error) {
      console.log({ error });
      res.statusCode = 500;

      // Handles Invalid API key error
      if (error.response?.status === 403) {
        res.statusCode = 403;
      }
      res.json({ error });
    }
  }
});
