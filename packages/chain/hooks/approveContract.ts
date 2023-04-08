import {
	approveTreatPancakeLPStaking,
	approveTreatStaking,
} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";

const useApproveContract = (
	pid,
	treatContract,
	treatLpContract,
	masterMelonFarmerContract
) => {
	const {address: account} = useAccount();

	const handleApprove = useCallback(async () => {
		try {
			let tx;
			if (pid === 0)
				tx = await approveTreatStaking(
					treatContract,
					masterMelonFarmerContract,
					account
				);
			else
				tx = await approveTreatPancakeLPStaking(
					treatLpContract,
					masterMelonFarmerContract,
					account
				);

			return tx;
		} catch (e) {
			console.error("errhandleApprove ", e);
			return false;
		}
	}, [account, treatContract]);

	return {onApprove: handleApprove};
};

export default useApproveContract;
