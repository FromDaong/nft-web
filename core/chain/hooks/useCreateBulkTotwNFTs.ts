import {
  createBulkTotwNFTs,
  getTotwMinterHelperContract,
} from "../../../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useCreateBulkTotwNFTs = (
  maxSupplys: Array<number>,
  creatorAddress: string
) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const totwMinterHelperContract = getTotwMinterHelperContract(treat);

  const handleCreateBulkTotwNFTs = useCallback(async () => {
    const res = await createBulkTotwNFTs(
      totwMinterHelperContract,
      account,
      maxSupplys,
      creatorAddress
    );

    return res;
  }, [account, maxSupplys, creatorAddress, totwMinterHelperContract]);

  return { onCreateBulkTotwNFTs: handleCreateBulkTotwNFTs };
};

export default useCreateBulkTotwNFTs;
