import {NextApiResponse} from "next";
import {NextApiRequest} from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {q} = req.query;

	if (!q) {
		return;
	}
}
