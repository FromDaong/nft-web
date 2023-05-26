import {ethers} from "ethers";
import {ABI} from "./abi";
import {contractAddresses} from "./treat-contracts-constants";

const customHttpProvider = new ethers.providers.JsonRpcProvider(
	"https://rpc.vnet.tenderly.co/devnet/treatdao/0077aa31-ff0e-4661-a507-6f5641b2230e"
);

export const treatMarketplaceContract = new ethers.Contract(
	contractAddresses.treatResaleMarketplaceMinter[56],
	ABI.treatMarketplace,
	customHttpProvider
);

export const treatMarketplaceReaderContract = new ethers.Contract(
	contractAddresses.treatMarketReader[56],
	ABI.treatMarketReader,
	customHttpProvider
);

export const treatSubscriptionContract = new ethers.Contract(
	contractAddresses.treatSubscriptions[56],
	ABI.treatSubscriptions,
	customHttpProvider
);

export const creatorMartContract = new ethers.Contract(
	contractAddresses.creatorMart[56],
	ABI.creatorMart,
	customHttpProvider
);

export const totmMartContract = new ethers.Contract(
	contractAddresses.totmMart[56],
	ABI.totmMart,
	customHttpProvider
);

export const treatNFTMinterContract = new ethers.Contract(
	contractAddresses.treatNFTMinter[56],
	ABI.treatMinter,
	customHttpProvider
);
