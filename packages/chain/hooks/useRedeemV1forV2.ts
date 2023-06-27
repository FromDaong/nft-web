import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useContracts} from "@packages/post/hooks";

const useRedeemV1forV2 = (ids: Array<string>, amounts: Array<string>) => {
	const {address: account} = useAccount();
	const {treatTradeInContract} = useContracts();

	const handleRedeemV1forV2 = useCallback(async () => {
		const txHash = await treatTradeInContract.tradeInMultiple(ids, amounts, {
			from: account,
		});

		return txHash;
	}, [account, ids, amounts, treatTradeInContract]);

	return {onRedeemV1forV2: handleRedeemV1forV2};
};

export default useRedeemV1forV2;
