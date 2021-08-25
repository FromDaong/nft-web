import { getCreatorReferrer, getTreatNFTMinterContract } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetReferrer = (modelAddress: string) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleGetReferrer = useCallback(async () => {
    const txHash = await getCreatorReferrer(
      treatNftMinterContract,
      modelAddress
    );
    console.log(txHash);
    return txHash;
  }, [modelAddress, treatNftMinterContract]);

  return { onGetReferrer: handleGetReferrer };
};

export default useGetReferrer;
