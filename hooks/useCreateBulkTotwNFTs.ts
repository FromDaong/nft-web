import {
  getTotwMinterHelperContract,
  createBulkTotwNFTs,
} from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useCreateBulkTotwNFTs = (
  maxSupplys: Array<number>,
  creatorAddress: string
) => {
  const { account } = useWallet();
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
