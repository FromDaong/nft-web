import {useCallback, useEffect, useState} from "react";

import BigNumber from "bignumber.js";

const useGetTreatNFTCost = (treatMartContract, id: number) => {
	const [theNftCost, setTheNftCost] = useState(new BigNumber(0));

	const fetchNftCost = useCallback(async () => {
		const theNftCost = new BigNumber(await treatMartContract.nftCosts(id));
		setTheNftCost(new BigNumber(theNftCost));
	}, [treatMartContract]);

	useEffect(() => {
		if (treatMartContract) {
			fetchNftCost();
		}
	}, [treatMartContract]);

	return theNftCost;
};

export default useGetTreatNFTCost;
