import {useCallback} from "react";
import {useAccount} from "wagmi";
import {useFarmContracts} from "@packages/farm/utils";

const useBuyMelonNft = () => {
	const {address: account} = useAccount();
	const {melonMart} = useFarmContracts();

	const handleBuyMelonNft = useCallback(async () => {
		const txHash = await await melonMart.redeem(0, {from: account});
		return txHash;
	}, [account, melonMart]);

	return {onBuyMelonNft: handleBuyMelonNft};
};

export default useBuyMelonNft;
