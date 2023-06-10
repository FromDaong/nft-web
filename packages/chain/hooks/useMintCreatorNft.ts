import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useMintCreatorNft = (id: number, treatCost: number) => {
	const {address: account} = useAccount();
	const {creatorMartContract} = useContracts();

	const handleMintCreatorNft = useCallback(async () => {
		const txHash = await creatorMartContract.redeem(id, {
			from: account,
			value: treatCost,
		});
		return txHash;
	}, [account, id, treatCost, creatorMartContract]);

	return {onMintCreatorNft: handleMintCreatorNft};
};

export default useMintCreatorNft;
