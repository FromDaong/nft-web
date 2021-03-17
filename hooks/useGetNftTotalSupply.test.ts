import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
//import { useWallet } from 'use-wallet'
import { getTreatNFTMinterContract, getNftTotalSupply } from '../treat/utils'
import useBlock from './useBlock'
import useTreat from './useTreat'


 const useGetNftTotalSupply = (nftId: number) => {
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0))
  //const { account }: { account: string } = useWallet()
  const treat = useTreat()
  const treatNFTMinterContract = getTreatNFTMinterContract(treat)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const totalSupply = await getNftTotalSupply(treatNFTMinterContract, nftId)
    setTotalSupply(new BigNumber(totalSupply))
  }, [nftId, smol])

  useEffect(() => {
    if (treat) {
      fetchBalance()
    }
  }, [nftId])

  return totalSupply
 }
 export default useGetNftTotalSupply
