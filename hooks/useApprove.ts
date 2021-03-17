
import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { approve, getTreatMartContract } from '../treat/utils'
import useTreat from './useTreat'



const useApprove = (treatMart: Contract) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const treat = useTreat()
  const treatMartContract = getTreatMartContract(treat)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(treatMartContract, account)
      console.log("tx ", tx)
      return tx
    } catch (e) {
      console.log("errhandleApprove2 ", e)
      return false
    }
  }, [account, treatMartContract])

  return { onApprove: handleApprove }
}

export default useApprove