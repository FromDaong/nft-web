import React, { createContext, useEffect, useState } from "react";

import Axios from "axios";
import { Treat } from "../../treat";
import { useMoralis } from "react-moralis";

export interface TreatContext {
  treat?: Treat;
  profile: object | null;
  fetchModelData: (account, user) => void;
}

export const Context = createContext<TreatContext>({
  treat: undefined,
  profile: null,
  fetchModelData: (account, user) => ({
    account,
    user,
  }),
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
    enableWeb3,
    isWeb3Enabled,
    account,
    user,
  } = useMoralis();
  const [treat, setTreat] = useState<any>();
  const [profile, setModelData] = useState<object | null>(null);

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

  const fetchModelData = (account, user) => {
    if (account && user) {
      Axios.post("/api/v2/auth/get-jwt", {
        ethAddress: account,
        sessionToken: user.getSessionToken(),
        username: user.getUsername(),
      }).then(() =>
        Axios.get(`/api/v2/auth/me`).then((res) => {
          setModelData(res.data);
        })
      );
    }
  };

  useEffect(() => {
    if (!profile && account && user) {
      fetchModelData(account, user);
    }
  }, [profile, account, user]);

  return (
    <Context.Provider value={{ treat, profile, fetchModelData }}>
      {children}
    </Context.Provider>
  );
};

export default TreatProvider;
