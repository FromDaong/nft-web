import { getMelonMartContract, createAndAddMelonNFTs } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useCreateAndAddMelonNFTs = (
  maxSupplys: Array<number>,
  creators: Array<string>,
  hexData: string
) => {
  const { account } = useWallet();
  const treat = useTreat();
  const melonMartContract = getMelonMartContract(treat);

  const handleCreateAndAddMelonNFTs = useCallback(async () => {
    const res = await createAndAddMelonNFTs(
      melonMartContract,
      account,
      maxSupplys,
      creators,
      hexData
    );

    return res;
  }, [account, maxSupplys, creators, hexData, melonMartContract]);

  return { onCreateAndAddMelonNFTs: handleCreateAndAddMelonNFTs };
};

export default useCreateAndAddMelonNFTs;
