import { getCreatorReferrer, getTreatNFTMinterContract } from "../treat/utils";
import { useCallback, useState, useEffect } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetReferrer = (modelAddress: string) => {
  const [ref, setRef] = useState(null);
  const { account } = useWallet();
  const treat = useTreat();
  const treatNftMinterContract = getTreatNFTMinterContract(treat);

  const handleGetReferrer = useCallback(async () => {
    const r = await getCreatorReferrer(treatNftMinterContract, modelAddress);
    setRef(r);
  }, [modelAddress, treatNftMinterContract]);

  useEffect(() => {
    if (treat) {
      handleGetReferrer();
    }
  }, [modelAddress]);

  return ref;
};

export default useGetReferrer;
