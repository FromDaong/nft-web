import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import bsc from "@binance-chain/bsc-use-wallet";
import { getTreatNFTMinterContract, getNftBalance } from '../treat/utils'
import useBlock from './useBlock'
import useTreat from './useTreat'

 const useGetNftBalance = (id: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const treat = useTreat()
  const treatNFTMinterContract = getTreatNFTMinterContract(treat)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getNftBalance(treatNFTMinterContract, account, id)
    setBalance(new BigNumber(balance))
  }, [account, id, treat])

  useEffect(() => {
    if (account && treat) {
      fetchBalance()
    }
  }, [id])

  return balance
 }
 export default useGetNftBalance
