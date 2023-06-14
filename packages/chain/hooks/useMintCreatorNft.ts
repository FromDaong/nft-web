import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";
import {BigNumber} from "ethers";

const useMintCreatorNft = (id: number, treatCost: BigNumber) => {
	const {address: account} = useAccount();
	const {creatorMartContract} = useContracts();

	const handleMintCreatorNft = useCallback(async () => {
		console.log(
			"minting creator nft: ",
			id,
			treatCost,
			account,
			creatorMartContract
		);
		const txHash = await creatorMartContract.redeem(id, {
			from: account,
			value: treatCost,
		});
		return txHash;
	}, [account, id, treatCost, creatorMartContract]);

	return {onMintCreatorNft: handleMintCreatorNft};
};

export default useMintCreatorNft;
