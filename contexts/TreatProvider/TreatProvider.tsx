import React, { createContext, useEffect, useState } from "react";

import { Treat } from "../../treat";
import { useMoralis } from "react-moralis";
import { useWallet } from "use-wallet";

export interface TreatContext {
  treat?: typeof Treat;
}

export const Context = createContext<TreatContext>({
  treat: undefined,
});

declare global {
  interface Window {
    treatsauce: any;
  }
}

const TreatProvider: React.FC = ({ children }) => {
  const { Moralis } = useMoralis();
  const { ethereum } = useWallet();
  const [treat, setTreat] = useState<any>();

  if (typeof window !== "undefined") {
    // @ts-ignore
    window.treat = treat;
    // @ts-ignore
    window.eth = ethereum; //Moralis.web3;
  }

  useEffect(() => {
    if (Moralis) {
      const chainId = Number(Moralis.web3.network.chainId);
      const treatLib = new Treat(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: "6000000",
        defaultGasPrice: "180000000000",
        accounts: [],
        ethereumNodeTimeout: 10000,
      });
      setTreat(treatLib);
      window.treatsauce = treatLib;
    }
  }, [ethereum]);

  return <Context.Provider value={{ treat }}>{children}</Context.Provider>;
};

export default TreatProvider;
