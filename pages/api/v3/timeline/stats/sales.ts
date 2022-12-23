import {NextApiResponse, NextApiRequest} from "next";
import {protectedAPIRoute} from "server/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	return {
		sales: [
			{
				nftId: 1,
				price: 100,
				currency: "ETH",
				date: "2021-01-01T00:00:00.000Z",
				buyer: "0x0000000000000000000000000000000000000000",
			},
		],
		commission: [
			{
				nftId: 1,
				amount: 10,
				currency: "ETH",
			},
		],
		total: {
			nfts: 1,
			commission: 10,
			sales: 1,
			volume: 100,
			currency: "ETH",
		},
	};
};

export default protectedAPIRoute(handler);
