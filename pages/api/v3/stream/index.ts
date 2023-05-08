import axios from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import {returnWithError} from "server/database/engine/utils";
import {returnWithSuccess} from "server/database/engine/utils";
import {connectMongoDB} from "server/database/engine";
import LegacyCreatorModel from "server/database/legacy/profile/Creator";
import Ban from "@db/legacy/privacy/Ban";
import Web3 from "web3";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
import LegacyNFTModel from "@db/legacy/nft/NFT";

const web3 = new Web3(
	"https://speedy-nodes-nyc.moralis.io/0e4b710bbd818e9709fe0ef5/bsc/mainnet"
);

function wait(time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve("hello"), time);
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	connectMongoDB();
	if (req.method === "GET") {
		try {
			res.status(200).json({success: true});
		} catch (error) {
			res.status(400).json({success: false, error: error});
		}
	} else if (req.method === "POST") {
		try {
			if (req.body.status !== "confirmed") return res.status(200);
			await wait(5000);

			const logs = await web3.eth.getPastLogs({
				address: contractAddresses.creatorMart[56],
				topics: [
					"0xf7cedc7e6a2774e7d4561b906b05ee6bf9ad54d7a37d85e89073694de3451f9e",
				],
				fromBlock: req.body.blockNumber - 3,
				toBlock: req.body.blockNumber + 1,
			});

			if (!logs || logs.length === 0) {
				return res.status(200).json({success: false});
			}

			const log = logs.find((l) => l.transactionHash === req.body.hash);

			const logDataArray = log.data
				.substring(2, log.data.length)
				.match(/.{1,64}/g);

			const numberOfNFTs = Web3.utils.hexToNumber("0x" + logDataArray[4]);

			const nftIDs = [...Array(numberOfNFTs).keys()].map((i) =>
				web3.utils.hexToNumber("0x" + logDataArray[5 + i])
			);
			const pendingNFTs = await LegacyNFTModel.find({
				tx_hash: log.transactionHash,
			});

			await pendingNFTs.forEach(async (n, i) => {
				try {
					const nftExists = await LegacyNFTModel.findOne({
						id: nftIDs[i],
					});
					if (nftExists) return nftExists;

					const newNFT = await LegacyNFTModel.create({
						id: nftIDs[i],
						...n.toObject(),
					});

					await LegacyCreatorModel.updateOne(
						{address: n.model_bnb_address},
						{
							$push: {
								nfts: {
									id: nftIDs[i],
								},
							},
						}
					);

					return newNFT;
				} catch (e) {
					console.error({e});
				}
			});
			res.status(200).json({success: true});
		} catch (error) {
			res.status(400).json({success: false, error: error});
		}
	}
}
