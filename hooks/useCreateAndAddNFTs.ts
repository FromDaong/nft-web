import { getCreatorMartContract, createAndAddNFTs } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useCreateAndAddNFTs = (
  maxSupplys: Array<number>,
  amounts: Array<number>,
  hexData: string
) => {
  const { account } = useWallet();
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const handleCreateAndAddNFTs = useCallback(async () => {
    console.log({ maxSupplys, amounts, hexData });
    const res = await createAndAddNFTs(
      creatorMartContract,
      account,
      maxSupplys,
      amounts,
      hexData
    );
    console.log(res);
    return res;
  }, [account, maxSupplys, amounts, hexData, creatorMartContract]);

  return { onCreateAndAddNFTs: handleCreateAndAddNFTs };
};

export default useCreateAndAddNFTs;
