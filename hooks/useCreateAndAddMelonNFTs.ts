import { getMelonMartContract, createAndAddMelonNFTs } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useCreateAndAddMelonNFTs = (
  maxSupplys: Array<number>,
  creators: Array<string>
) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const melonMartContract = getMelonMartContract(treat);

  const handleCreateAndAddMelonNFTs = useCallback(async () => {
    const res = await createAndAddMelonNFTs(
      melonMartContract,
      account,
      maxSupplys,
      creators,
      "0x"
    );

    return res;
  }, [account, maxSupplys, creators, melonMartContract]);

  return { onCreateAndAddMelonNFTs: handleCreateAndAddMelonNFTs };
};

export default useCreateAndAddMelonNFTs;
