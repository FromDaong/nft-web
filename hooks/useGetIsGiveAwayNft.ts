import {
  getCreatorMartContract,
  getIsGiveAwayNft,
} from "../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useGetIsGiveAwayNft = () => {
  const { account } = useMoralis();
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const handleGetIsGiveAwayNft = useCallback(async () => {
    const txHash = await getIsGiveAwayNft(creatorMartContract, account);

    return txHash;
  }, [account, creatorMartContract]);

  return { onGetIsGiveAwayNft: handleGetIsGiveAwayNft };
};

export default useGetIsGiveAwayNft;
