import {getTreatMartContract, mintNft} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useMintNft = (id: number, treatCost: number, useTreatMart = false) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatMartContract = useTreatMart
		? getTreatMartContract(treat)
		: getTreatMartContract(treat);

	const handleMintNft = useCallback(async () => {
		const txHash = await mintNft(treatMartContract, account, id, treatCost);
		return txHash;
	}, [account, id, treatCost, treatMartContract]);

	return {onMintNft: handleMintNft};
};

export default useMintNft;
