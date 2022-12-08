import {getCreatorMartContract, mintCreatorNft} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useMintCreatorNft = (
	id: number,
	treatCost: number,
	useCreatorMart = false
) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const creatorMartContract = useCreatorMart
		? getCreatorMartContract(treat)
		: getCreatorMartContract(treat);

	const handleMintCreatorNft = useCallback(async () => {
		const txHash = await mintCreatorNft(
			creatorMartContract,
			account,
			id,
			treatCost
		);
		return txHash;
	}, [account, id, treatCost, creatorMartContract]);

	return {onMintCreatorNft: handleMintCreatorNft};
};

export default useMintCreatorNft;
