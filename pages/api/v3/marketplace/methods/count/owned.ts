import axios from "axios";
import {connectMongoDB} from "@db/engine";
import {
	populateNFTsWithProfileAndTx,
	returnWithError,
	returnWithSuccess,
} from "@db/engine/utils";
import Moralis from "moralis";
import {EvmChain} from "@moralisweb3/common-evm-utils";
import {contractAddresses} from "@packages/treat/lib/constants";
import connectMoralis from "@utils/moralis";
import {MongoModelProfile} from "server/helpers/models";

export default async function handler(req, res) {
	const {address} = req.query;

	if (!address) {
		return returnWithError("No username provided", 400, res);
	}

	await connectMoralis();
	await connectMongoDB();

	const profile = await MongoModelProfile.findOne({
		address: address.toString().toLowerCase(),
	});

	if (!profile) {
		return returnWithError("No profile found", 400, res);
	}

	const resp = await axios.get(
		`https://deep-index.moralis.io/api/v2/${
			profile.address
		}/nft?chain=bsc&disable_total=false&format=decimal&token_address=${[
			contractAddresses.treatNFTMinter[56],
		]}`,
		{
			headers: {
				"X-API-Key":
					"OnC1EoANtnaL6ijxI6jZbO0E3GAf5hFkHmYrn1hWTamNT7vuUQ1JUvBwFYchxdIu",
			},
		}
	);

	return returnWithSuccess(resp.data.total, res);
}
