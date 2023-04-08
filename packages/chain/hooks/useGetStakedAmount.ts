import {
	getMasterMelonFarmerContract,
	getStaked,
	getV1MasterMelonFarmerContract,
} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useGetStakedAmount = (
	pid: number,
	v1: boolean,
	masterMelonFarmerContract,
	v1MasterMelonFarmerContract
) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const [stakedAmount, setStakedAmount] = useState(null);

	const fetchStakedAmount = useCallback(async () => {
		const amount = await getStaked(
			v1 ? v1MasterMelonFarmerContract : masterMelonFarmerContract,
			pid,
			account
		);

		setStakedAmount(amount);
	}, [account, masterMelonFarmerContract, pid]);

	useEffect(() => {
		if (treat) {
			fetchStakedAmount();
		}
	}, [pid, treat]);

	return stakedAmount;
};

export default useGetStakedAmount;
