import { useCallback, useState } from "react";

import { getCreatorMartContract } from "../treat/utils";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

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
