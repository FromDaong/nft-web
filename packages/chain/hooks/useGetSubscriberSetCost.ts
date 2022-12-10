import {
	getSubscriberMartContract,
	getSubscriberSetPrice,
} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetSubscriberSetCost = (id: number) => {
	const [nftSetCost, setNftSetCost] = useState(new BigNumber(0));
	const treat = useTreat();
	const subscriberMartContract = getSubscriberMartContract(treat);

	const fetchSetCost = useCallback(async () => {
		const nftSetCost = await getSubscriberSetPrice(subscriberMartContract, id);
		setNftSetCost(new BigNumber(nftSetCost));
	}, [id, treat]);

	useEffect(() => {
		if (treat) {
			fetchSetCost();
		}
	}, [id, treat]);

	return nftSetCost;
};

export default useGetSubscriberSetCost;
