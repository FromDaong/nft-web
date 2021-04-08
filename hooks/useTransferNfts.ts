import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { getTreatNFTMinterContract, transferNfts } from '../treat/utils'
import useTreat from './useTreat'



const useTransferNfts = () => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const treat = useTreat()
  const treatMinterContract = getTreatNFTMinterContract(treat)

  const handleTransfer = useCallback(async (to: string, id: number, amount: number) => {
    try {
      const tx = await transferNfts(treatMinterContract, account, to, id, amount)
      console.log("tx ", tx)
      return tx
    } catch (e) {
      console.log("errhandleApprove2 ", e)
      return false
    }
  }, [account, treatMinterContract])

  return { onTransferNfts: handleTransfer }
}

export default useTransferNfts