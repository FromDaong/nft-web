import {
  getCreatorReferrer,
  getTreatNFTMinterContract,
} from "../../../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import useTreat from "./useTreat";

const useGetReferrer = (modelAddress: string) => {
  const [ref, setRef] = useState(null);
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
