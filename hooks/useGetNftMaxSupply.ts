import {
  getNftMaxSupply,
  getTreatNFTMinterContract,
} from "../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetNftMaxSupply = (id: number) => {
  const [maxSupply, setMaxSupply] = useState(new BigNumber(0));
  const treat = useTreat();
  const treatNFTMinterContract = getTreatNFTMinterContract(treat);

  const fetchBalance = useCallback(async () => {
    const maxSupply = await getNftMaxSupply(treatNFTMinterContract, id);
    setMaxSupply(new BigNumber(maxSupply));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchBalance();
    }
  }, [id]);

  return maxSupply;
};

export default useGetNftMaxSupply;
