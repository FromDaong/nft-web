import {
	createAndAddMelonNFTs,
	getMelonMartContract,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useCreateAndAddMelonNFTs = (
	maxSupplys: Array<number>,
	creators: Array<string>
) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const melonMartContract = getMelonMartContract(treat);

	const handleCreateAndAddMelonNFTs = useCallback(async () => {
		const res = await createAndAddMelonNFTs(
			melonMartContract,
			account,
			maxSupplys,
			creators,
			"0x"
		);

		return res;
	}, [account, maxSupplys, creators, melonMartContract]);

	return {onCreateAndAddMelonNFTs: handleCreateAndAddMelonNFTs};
};

export default useCreateAndAddMelonNFTs;
