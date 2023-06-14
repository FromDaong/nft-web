import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useGetFreeCreatorTreat = (id: number) => {
	const {address: account} = useAccount();
	const {creatorMartContract} = useContracts();

	const handleMintCreatorNft = useCallback(async () => {
		const txHash = await creatorMartContract.redeemFreeTreat(id, {
			from: account,
			value: 0,
		});
		return txHash;
	}, [account, id, creatorMartContract]);

	return {onGetFreeCreatorTreat: handleMintCreatorNft};
};

export default useGetFreeCreatorTreat;
