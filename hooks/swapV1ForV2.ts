import {
  getTreatV1ForV2Contract,
  tradeInV1ForV2,
} from "../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const swapV1ForV2 = (amount: number) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatTradeInV1ForV2Contract = getTreatV1ForV2Contract(treat);

  const handleTradeInV1ForV2 = useCallback(async () => {
    const txHash = await tradeInV1ForV2(
      treatTradeInV1ForV2Contract,
      account,
      amount
    );

    return txHash;
  }, [account, amount, treatTradeInV1ForV2Contract]);

  return { onTradeInV1ForV2: handleTradeInV1ForV2 };
};

export default swapV1ForV2;
