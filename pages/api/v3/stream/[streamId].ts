import axios from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import {returnWithError} from "server/database/engine/utils";
import {returnWithSuccess} from "server/database/engine/utils";
import {connectMongoDB} from "server/database/engine";
import LegacyCreatorModel from "server/database/legacy/profile/Creator";
import Ban from "@db/legacy/privacy/Ban";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	connectMongoDB();
	if (req.method === "GET") {
		const {streamId} = req.query;
		try {
			const streamStatusResponse = await axios.get(
				`https://livepeer.com/api/stream/${streamId}`,
				{
					headers: {
						"content-type": "application/json",
						authorization: `Bearer ${"06b4bf90-1f97-4175-9295-8bf72642ef8a"}`,
					},
				}
			);

			if (streamStatusResponse && streamStatusResponse.data) {
				const livestreamModel = await LegacyCreatorModel.findOne({
					"live.stream_id": streamId,
				});
				const banned = await Ban.find({
					channel: livestreamModel.live.playback_id,
				});
				returnWithSuccess(
					{...streamStatusResponse.data, banned: [...banned]},
					res
				);
			} else {
				return returnWithError("No live streams found", 404, res);
			}
		} catch (err) {
			return returnWithError(err.message, 500, res);
		}
	}
}
