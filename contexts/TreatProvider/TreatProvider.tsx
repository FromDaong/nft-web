import React, { createContext, useEffect, useState } from "react";

import { Treat } from "../../treat";
import { useMoralis } from "react-moralis";

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
  const {
    Moralis,
    chainId: _chainId,
    provider,
    account,
    enableWeb3,
    isWeb3Enabled,
  } = useMoralis();
  const [treat, setTreat] = useState<any>();

  if (typeof window !== "undefined") {
    // @ts-ignore
    window.treat = treat;
    // @ts-ignore
    window.eth = Moralis.provider; //Moralis.web3;
  }

  useEffect(() => {
    enableWeb3();
  }, []);

  useEffect(() => {
    if (isWeb3Enabled && provider) {
      const chainId = Number(_chainId);
      const treatLib = new Treat(provider, chainId, false, {
        defaultAccount: (provider as any).selectedAddress,
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
  }, [provider, isWeb3Enabled]);

  return <Context.Provider value={{ treat }}>{children}</Context.Provider>;
};

export default TreatProvider;
