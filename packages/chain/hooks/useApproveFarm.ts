import {
	approveTreatPancakeLPStaking,
	approveTreatStaking,
	getMasterMelonFarmerContract,
} from "@packages/chain/utils";

import {Contract} from "ethers";
import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useApproveFarm = (lpContract: Contract, pid: number) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const masterMelonFarmerContract = getMasterMelonFarmerContract(treat);

	const handleApproveFarm = useCallback(async () => {
		try {
			if (pid == 0) {
				const tx = await approveTreatStaking(
					masterMelonFarmerContract,
					account
				);

				return tx;
			} else {
				const tx = await approveTreatPancakeLPStaking(
					masterMelonFarmerContract,
					account
				);

				return tx;
			}
		} catch (e) {
			console.error("errhandleApprove2 ", e);
			return false;
		}
	}, [account, masterMelonFarmerContract]);

	return {onApproveFarm: handleApproveFarm};
};

export default useApproveFarm;
