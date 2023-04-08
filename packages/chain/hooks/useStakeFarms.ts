import {stakeFarm} from "@packages/treat/utils";
import {useCallback} from "react";
import {useAccount} from "wagmi";

const useStakeFarms = (pid: number, masterMelonFarmerContract) => {
	const {address: account} = useAccount();

	const handleStake = useCallback(
		async (amount: string) => {
			const txHash = await stakeFarm(
				masterMelonFarmerContract,
				pid,
				amount,
				account
			);
			console.info(txHash);
		},
		[account, masterMelonFarmerContract, pid]
	);

	return {onStake: handleStake};
};

export default useStakeFarms;
