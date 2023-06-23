import withSession from "@lib/session";
import {connectMongoDB} from "server/helpers/core";

export default withSession(async (req, res) => {
	const {method} = req;

	await connectMongoDB();

	switch (method) {
		case "POST":
			try {
				if (
					!req.body.master_password ||
					req.body.master_password !== "treatisgreat"
				)
					return res.status(400).json({success: false, error: "invalid pass"});

				await req.session.set("admin", true);
				await req.session.save();

				return res.status(200).json({success: true});
			} catch (error) {
				res.status(400).json({success: false, error: error});
			}
			break;
		default:
			res.status(400).json({success: false});
			break;
	}
});
