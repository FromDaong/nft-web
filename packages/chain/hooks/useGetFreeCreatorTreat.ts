import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useGetFreeCreatorTreat = (id: number, treatCost: number) => {
	const {address: account} = useAccount();
	const {creatorMartContract} = useContracts();

	const handleMintCreatorNft = useCallback(async () => {
		const txHash = await creatorMartContract.redeemFreeTreat(id, {
			from: account,
			value: treatCost,
		});
		return txHash;
	}, [account, id, treatCost, creatorMartContract]);

	return {onGetFreeCreatorTreat: handleMintCreatorNft};
};

export default useGetFreeCreatorTreat;
