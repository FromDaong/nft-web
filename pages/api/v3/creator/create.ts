import TreatNFTMinterABI from "packages/treat/lib/abi/treatnftminter.json";
import {connectMongoDB} from "server/database/engine";
import {returnWithError, returnWithSuccess} from "server/database/engine/utils";
import {NextApiRequest, NextApiResponse} from "next";
import {MongoModelCreator, MongoModelProfile} from "server/helpers/models";
import {protectedAPIRoute} from "server/utils";
import {ethers} from "ethers";
import {contractAddresses} from "@packages/treat/lib/treat-contracts-constants";
/*
const TreatMinterContract = () => {
	const provider = new ethers.providers.JsonRpcProvider(
		process.env.NEXT_PUBLIC_RPC_NODE_URL,
		56
	);
	const signer = new ethers.Wallet(
		process.env.WHITELIST_ADMIN_PRIVATE_KEY,
		provider
	);
	const contract = new ethers.Contract(
		contractAddresses.treatNFTMinter[56],
		TreatNFTMinterABI,
		signer
	);

	return {contract, signer};
};
const approveWalletOnChain = async (creatorAddress: string) => {
	const {contract, signer} = TreatMinterContract();
	return contract.addPerformer(creatorAddress, {
		from: signer.address,
		value: 0,
	});
};
*/

async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectMongoDB();
	const {session} = req;
	const {email, identity_access_key} = req.body;

	if (!email) {
		return returnWithError(
			{
				email: "Please enter a valid email address.",
			},
			401,
			res
		);
	}

	if (!identity_access_key) {
		return returnWithError(
			{
				identity_access_key: "Please enter a valid identity access key.",
			},
			401,
			res
		);
	}
	if (!session) {
		return returnWithError(
			{
				session: "Please login to create a creator profile.",
			},
			401,
			res
		);
	}

	try {
		const profile = await MongoModelProfile.findOne({
			address: session.address.toLowerCase(),
		});

		await MongoModelProfile.findOneAndUpdate(
			{
				profile: profile._id,
			},
			{
				$set: {
					email,
					identity_access_key,
				},
			}
		);

		// On-chain approval
		// await approveWalletOnChain(session.address);

		// Create new creator profile
		const creatorProfile = new MongoModelCreator({
			username: profile.username,
			address: profile.address,
			profile: profile._id,
			totm: {
				current: false,
			},
			user: profile.user,
			pending: false,
			approved: true,
			subscription: {
				cost: Number(0.01),
				description: "Temporary description",
			},
			subscriptions_enabled: false,
			identity_access_key,
		});

		await creatorProfile.save();
		return returnWithSuccess(creatorProfile, res);
	} catch (err) {
		console.log({err});
		return returnWithError(
			"An error occurred while creating your profile. Please try again.",
			400,
			res
		);
	}
}

export default protectedAPIRoute(handler);
