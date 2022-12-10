import {getTreatNFTMinterContract, transferNfts} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useTransferNfts = () => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatMinterContract = getTreatNFTMinterContract(treat);

	const handleTransfer = useCallback(
		async (to: string, id: number, amount: number) => {
			try {
				const tx = await transferNfts(
					treatMinterContract,
					account,
					to,
					id,
					amount
				);
				return tx;
			} catch (e) {
				console.error("errhandleApprove2 ", e);
				return false;
			}
		},
		[account, treatMinterContract]
	);

	return {onTransferNfts: handleTransfer};
};

export default useTransferNfts;
