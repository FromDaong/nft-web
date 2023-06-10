import {useCallback, useEffect, useState} from "react";

import BigNumber from "bignumber.js";

const useGetSubscriberNftCost = (subscriptionsMartContract, id: number) => {
	const [theNftCost, setTheNftCost] = useState(new BigNumber(0));

	const fetchNftCost = useCallback(async () => {
		const theNftCost = new BigNumber(
			await subscriptionsMartContract.nftCosts(id)
		);
		setTheNftCost(new BigNumber(theNftCost));
	}, [subscriptionsMartContract]);

	useEffect(() => {
		if (subscriptionsMartContract) {
			fetchNftCost();
		}
	}, [subscriptionsMartContract]);

	return theNftCost;
};

export default useGetSubscriberNftCost;
