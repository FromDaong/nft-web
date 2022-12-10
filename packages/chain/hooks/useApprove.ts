import {approve, getTreatMartContract} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useApprove = () => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatMartContract = getTreatMartContract(treat);

	const handleApprove = useCallback(async () => {
		try {
			const tx = await approve(treatMartContract, account);
			return tx;
		} catch (e) {
			console.error("errhandleApprove2 ", e);
			return false;
		}
	}, [account, treatMartContract]);

	return {onApprove: handleApprove};
};

export default useApprove;
