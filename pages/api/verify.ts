import {ironOptions} from "@utils/index";
import {withIronSessionApiRoute} from "iron-session/next";
import {NextApiRequest, NextApiResponse} from "next";
import {SiweMessage} from "siwe";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {message, signature} = req.body;

	const siweMessage = new SiweMessage(message);
	const fields = await siweMessage.validate(signature);

	if (fields.nonce !== req.session.nonce)
		return res.status(422).json({message: "Invalid nonce."});
	fields.address = fields.address.toLowerCase();
	req.session.siwe = fields;
	await req.session.save();
	res.json({ok: true});
};

export default withIronSessionApiRoute(handler, ironOptions);
