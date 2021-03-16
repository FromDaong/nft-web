import React, { createContext, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { Treat } from '../../treat'



export interface TreatContext {
  treat?: typeof Treat
}

export const Context = createContext<TreatContext>({
  treat: undefined,
})

declare global {
  interface Window {
    treatsauce: any
  }
}

const TreatProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [treat, setTreat] = useState<any>()

  // @ts-ignore
  window.treat = treat
  // @ts-ignore
  window.eth = ethereum

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const treatLib = new Treat(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '180000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setTreat(treatLib)
      window.treatsauce = treatLib
    }
  }, [ethereum])

  return <Context.Provider value={{ treat }}>{children}</Context.Provider>
}

export default TreatProvider
