import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useMintNft = (id: number, treatCost: number) => {
	const {address: account} = useAccount();
	const {totmMartContract} = useContracts();

	const handleMintNft = useCallback(async () => {
		const txHash = await totmMartContract.redeem(id, {
			from: account,
			value: treatCost,
		});
		return txHash;
	}, [account, id, treatCost, totmMartContract]);

	return {onMintNft: handleMintNft};
};

export default useMintNft;
