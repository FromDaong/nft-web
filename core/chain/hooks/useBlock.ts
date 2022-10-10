import { useEffect, useState } from "react";

import Web3 from "web3";
import { useMoralis } from "react-moralis";

const useBlock = () => {
  const [block, setBlock] = useState(0);
  const { provider } = useMoralis();

  useEffect(() => {
    if (!provider) return;
    const web3 = new Web3(provider as any);

    const interval = setInterval(async () => {
      const latestBlockNumber = await web3.eth.getBlockNumber();
      if (block !== latestBlockNumber) {
        setBlock(latestBlockNumber);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [provider]);

  return block;
};

export default useBlock;
