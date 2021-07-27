import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
//import { useWallet } from 'use-wallet'
import { getTreatNFTMinterContract, getNftMaxSupply } from "../treat/utils";
import useBlock from "./useBlock";
import useTreat from "./useTreat";

const useGetNftMaxSupply = (id: number) => {
  const [maxSupply, setMaxSupply] = useState(new BigNumber(0));
  //const { account }: { account: string } = useWallet()
  const treat = useTreat();
  const treatNFTMinterContract = getTreatNFTMinterContract(treat);
  const block = useBlock();

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
