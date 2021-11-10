import { useCallback } from 'react'
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import { getMasterMelonFarmerContract, stakeFarm } from '../treat/utils'

const useStakeFarms = (pid: number) => {
  const masterMelonFarmerContract = getMasterMelonFarmerContract()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stakeFarm(masterMelonFarmerContract, pid, amount)
      console.info(txHash)
    },
    [masterMelonFarmerContract, pid],
  )

  return { onStake: handleStake }
}

export default useStakeFarms