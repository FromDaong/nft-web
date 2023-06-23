import {useCallback, useEffect, useState} from "react";

import useTreat from "./useTreat";
import {useContracts} from "@packages/post/hooks";

const useGetReferrer = (modelAddress: string) => {
	const [ref, setRef] = useState(null);
	const treat = useTreat();
	const {treatMinterContract} = useContracts();

	const handleGetReferrer = useCallback(async () => {
		const refAddress = await treatMinterContract.referrers(modelAddress);
		setRef(new refAddress());
	}, [modelAddress, treatMinterContract]);

	useEffect(() => {
		if (treat) {
			handleGetReferrer();
		}
	}, [modelAddress]);

	return ref;
};

export default useGetReferrer;
