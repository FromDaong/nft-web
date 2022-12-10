import {getCreatorMartContract, getIsGiveAwayNft} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useGetIsGiveAwayNft = () => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const creatorMartContract = getCreatorMartContract(treat);

	const handleGetIsGiveAwayNft = useCallback(async () => {
		const txHash = await getIsGiveAwayNft(creatorMartContract, account);

		return txHash;
	}, [account, creatorMartContract]);

	return {onGetIsGiveAwayNft: handleGetIsGiveAwayNft};
};

export default useGetIsGiveAwayNft;
