import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
//import { useWallet } from 'use-wallet'
import { getTreatNFTMinterContract, getNftTotalSupply } from '../treat/utils'
import useBlock from './useBlock'
import useTreat from './useTreat'


 const useGetNftTotalSupply = (id: number) => {
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0))
  //const { account }: { account: string } = useWallet()
  const treat = useTreat()
  const treatNFTMinterContract = getTreatNFTMinterContract(treat)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const totalSupply = await getNftTotalSupply(treatNFTMinterContract, id)
    setTotalSupply(new BigNumber(totalSupply))
  }, [id, treat])

  useEffect(() => {
    if (treat) {
      fetchBalance()
    }
  }, [id])

  return totalSupply
 }
 export default useGetNftTotalSupply
