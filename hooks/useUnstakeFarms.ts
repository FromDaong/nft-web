import { useCallback } from 'react'
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import { getMasterMelonFarmerContract, unstakeFarm } from '../treat/utils'

const useUnstakeFarms = (pid: number) => {
  const { account } = useWallet();
  const treat = useTreat();
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat)

  const handleUnstake = useCallback(
    async (amount: string) => {
      await unstakeFarm(masterMelonFarmerContract, pid, amount)
    },
    [masterMelonFarmerContract, pid],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms

