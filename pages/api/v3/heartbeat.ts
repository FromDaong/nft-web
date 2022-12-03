import {NextApiRequest, NextApiResponse} from "next";
export default function heartbeat(req: NextApiRequest, res: NextApiResponse) {
	return res.status(200).json({
		services: [
			{
				name: "Authentication Service",
				description:
					"Responsible for wallet connections and generating signatures.",
				status: "up",
			},
			{
				name: "Profiles & Discovery Service",
				description:
					"Responsible for wallet connections and generating signatures.",
				status: "down",
			},
			{
				name: "Posts, Blockchain & Sweetshop Service",
				description:
					"Responsible for wallet connections and generating signatures.",
				status: "down",
			},
			{
				name: "Notifications Service",
				description:
					"Responsible for wallet connections and generating signatures.",
				status: "down",
			},
			{
				name: "Livestreaming Service",
				description:
					"Responsible for wallet connections and generating signatures.",
				status: "down",
			},
		],
	});
}
