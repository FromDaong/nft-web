import {getSubscriberMartContract, mintSubNft} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useMintSubscriberNft = (
	id: number,
	treatCost: number,
	useSubscriberMart = false
) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const subscriberMartContract = useSubscriberMart
		? getSubscriberMartContract(treat)
		: getSubscriberMartContract(treat);

	const handleMintSubscriberNft = useCallback(async () => {
		const txHash = await mintSubNft(
			subscriberMartContract,
			account,
			id,
			treatCost
		);
		return txHash;
	}, [account, id, treatCost, subscriberMartContract]);

	return {onMintSubscriberNft: handleMintSubscriberNft};
};

export default useMintSubscriberNft;
