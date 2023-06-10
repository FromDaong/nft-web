import {useCallback, useEffect, useState} from "react";

import BigNumber from "bignumber.js";

const useGetCreatorNftCost = (creatorMartContract, id: number) => {
	const [theNftCost, setTheNftCost] = useState(new BigNumber(0));

	const fetchNftCost = useCallback(async () => {
		const theNftCost = new BigNumber(await creatorMartContract.nftCosts(id));
		setTheNftCost(new BigNumber(theNftCost));
	}, [creatorMartContract]);

	useEffect(() => {
		if (creatorMartContract) {
			fetchNftCost();
		}
	}, [creatorMartContract]);

	return theNftCost;
};

export default useGetCreatorNftCost;
