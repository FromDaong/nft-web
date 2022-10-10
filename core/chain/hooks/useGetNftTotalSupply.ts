import {
  getNftTotalSupply,
  getTreatNFTMinterContract,
} from "../../../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetNftTotalSupply = (id: number) => {
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const treat = useTreat();
  const treatNFTMinterContract = getTreatNFTMinterContract(treat);

  const fetchBalance = useCallback(async () => {
    const totalSupply = await getNftTotalSupply(treatNFTMinterContract, id);
    setTotalSupply(new BigNumber(totalSupply));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchBalance();
    }
  }, [id]);

  return totalSupply;
};
export default useGetNftTotalSupply;
