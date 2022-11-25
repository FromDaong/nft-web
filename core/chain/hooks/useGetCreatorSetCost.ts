import {
  getCreatorMartContract,
  getCreatorSetPrice,
} from "../../../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetCreatorSetCost = (id: number) => {
  const [nftSetCost, setNftSetCost] = useState(BigNumber.from(0));
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const fetchNftCost = useCallback(async () => {
    const nftSetCost = await getCreatorSetPrice(creatorMartContract, id);
    setNftSetCost(BigNumber.from(nftSetCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchNftCost();
    }
  }, [id, treat]);

  return nftSetCost;
};

export default useGetCreatorSetCost;
