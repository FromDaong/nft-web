import { getCreatorMartContract, createAndAddNFTs } from "../treat/utils";
import { useCallback, useState } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useCreateAndAddNFTs = (
  maxSupplys: Array<number>,
  amounts: Array<number>,
  hexData: string
) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const [currentTxHash, setTxHash] = useState(null);
  const [returnData, setReturnData] = useState(null);
  const creatorMartContract = getCreatorMartContract(treat);

  const handleCreateAndAddNFTs = useCallback(async () => {
    setTxHash(null);
    creatorMartContract.methods
      .createAndAddNFTs(
        maxSupplys,
        amounts,
        amounts.map(() => false),
        hexData
      )
      .send()
      .once("transactionHash", (result) => {
        setTxHash(result);
      })
      .then((result) => {
        setReturnData(result.events.NFTCreatedAndAdded.returnValues);
      });
  }, [account, maxSupplys, amounts, hexData, creatorMartContract]);

  return {
    onCreateAndAddNFTs: handleCreateAndAddNFTs,
    data: returnData,
    txHash: currentTxHash,
  };
};

export default useCreateAndAddNFTs;
