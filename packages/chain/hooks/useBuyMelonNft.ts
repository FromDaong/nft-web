import {buyMelonNft, getMelonMartContract} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useBuyMelonNft = () => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const melonMartContract = getMelonMartContract(treat);

	const handleBuyMelonNft = useCallback(async () => {
		const txHash = await buyMelonNft(melonMartContract, account);
		return txHash;
	}, [account, melonMartContract]);

	return {onBuyMelonNft: handleBuyMelonNft};
};

export default useBuyMelonNft;
