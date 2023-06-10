import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useGetFreeTreat = (id: number, treatCost: number) => {
	const {address: account} = useAccount();
	const {totmMartContract} = useContracts();

	const handleMintNft = useCallback(async () => {
		const txHash = await totmMartContract.redeemFreeTreat(id, {
			from: account,
			value: 0,
		});
		return txHash;
	}, [account, id, treatCost, totmMartContract]);

	return {onGetFreeTreat: handleMintNft};
};

export default useGetFreeTreat;
