import connectMoralis from "@utils/moralis";
import Moralis from "moralis";

const config = {
	domain: process.env.APP_DOMAIN,
	statement: "Please sign this message to confirm your wallet.",
	uri: process.env.NEXTAUTH_URL,
	timeout: 60,
};

export default async function handler(req, res) {
	const {address, chain, network} = req.body;

	await connectMoralis;

	try {
		const message = await Moralis.Auth.requestMessage({
			address,
			chain,
			network,
			...config,
		});

		res.status(200).json(message);
	} catch (error) {
		res.status(400).json({error});
		console.error(error);
	}
}
