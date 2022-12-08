import {getTreatTradeInContract, redeemV1forV2} from "@packages/chain/utils";

import {useCallback} from "react";
import {useAccount} from "wagmi";
import useTreat from "./useTreat";

const useRedeemV1forV2 = (ids: Array<string>, amounts: Array<string>) => {
	const {address: account} = useAccount();
	const treat = useTreat();
	const treatTradeInContract = getTreatTradeInContract(treat);

	const handleRedeemV1forV2 = useCallback(async () => {
		const txHash = await redeemV1forV2(
			treatTradeInContract,
			account,
			ids,
			amounts
		);

		return txHash;
	}, [account, ids, amounts, treatTradeInContract]);

	return {onRedeemV1forV2: handleRedeemV1forV2};
};

export default useRedeemV1forV2;
