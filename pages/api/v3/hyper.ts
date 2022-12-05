import {NextApiRequest, NextApiResponse} from "next";
export default function heartbeat(req: NextApiRequest, res: NextApiResponse) {
	if (req.body.actor !== "hyperchecker") {
		return res.status(400).json({
			error: "Dead",
		});
	}
	return res.status(200).send("I am alive");
}
