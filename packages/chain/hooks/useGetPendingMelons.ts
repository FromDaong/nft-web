import {getPendingMelons} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import {useAccount, useSigner} from "wagmi";

const useGetPendingMelons = (pid: number, masterMelonFarmerContract) => {
	const {address: account} = useAccount();
	const {data} = useSigner();
	const [pendingMelons, setPendingMelons] = useState<number | null>(null);

	const fetchPendingMelons = useCallback(async () => {
		const amount = await getPendingMelons(
			masterMelonFarmerContract,
			pid,
			account
		);

		setPendingMelons(amount.toNumber());
	}, [account, masterMelonFarmerContract, pid]);

	useEffect(() => {
		if (data) {
			fetchPendingMelons();
		}
	}, [pid, data]);

	return pendingMelons;
};

export default useGetPendingMelons;
