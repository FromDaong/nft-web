import { getTreatTradeInContract, redeemV1forV2 } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useRedeemV1forV2 = (ids: Array<string>, amounts: Array<string>) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatTradeInContract = getTreatTradeInContract(treat);

  const handleRedeemV1forV2 = useCallback(async () => {
    console.log(123, ids, amounts);
    const txHash = await redeemV1forV2(
      treatTradeInContract,
      account,
      ids,
      amounts
    );

    return txHash;
  }, [account, ids, amounts, treatTradeInContract]);

  return { onRedeemV1forV2: handleRedeemV1forV2 };
};

export default useRedeemV1forV2;
