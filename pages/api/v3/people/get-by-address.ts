// next api routes that takes an array of addresses and converts them to lowerCase and returns the result

import {NextApiRequest, NextApiResponse} from "next";
import {returnWithError, returnWithSuccess} from "server/helpers/core/utils";
import {MongoModelProfile} from "server/helpers/models";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {addresses} = req.body;
	if (!addresses) {
		return returnWithError("No addresses provided", 400, res);
	}

	if (!Array.isArray(addresses)) {
		return returnWithError("Addresses must be an array", 400, res);
	}

	const lowerCaseAddresses = addresses.map((address: string) =>
		address.toLowerCase()
	);

	try {
		const profiles = await MongoModelProfile.find({
			address: {$in: lowerCaseAddresses},
		});
		return returnWithSuccess(profiles, res);
	} catch (err) {
		console.error(err);
		return returnWithError(
			"An error occurred while fetching profiles",
			500,
			res
		);
	}
}
