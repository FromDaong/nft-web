import {
	getSubscriberMartContract,
	getSubscriberNftCost,
} from "@packages/chain/utils";
import {useCallback, useEffect, useState} from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetSubscriberNftCost = (id: number, useSubscriberMart = false) => {
	const [theNftCost, setTheNftCost] = useState(new BigNumber(0));
	const treat = useTreat();
	const subscriberMartContract = useSubscriberMart
		? getSubscriberMartContract(treat)
		: getSubscriberMartContract(treat);

	const fetchNftCost = useCallback(async () => {
		const theNftCost = await getSubscriberNftCost(subscriberMartContract, id);
		setTheNftCost(new BigNumber(theNftCost));
	}, [id, treat]);

	useEffect(() => {
		if (treat) {
			fetchNftCost();
		}
	}, [id]);

	return theNftCost;
};

export default useGetSubscriberNftCost;
