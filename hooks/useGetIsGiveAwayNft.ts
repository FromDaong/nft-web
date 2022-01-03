import { getIsGiveAwayNft, getCreatorMartContract } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetIsGiveAwayNft = () => {
  const { account } = useWallet();
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const handleGetIsGiveAwayNft = useCallback(async () => {
    const txHash = await getIsGiveAwayNft(creatorMartContract, account);

    return txHash;
  }, [account, creatorMartContract]);

  return { onGetIsGiveAwayNft: handleGetIsGiveAwayNft };
};

export default useGetIsGiveAwayNft;
