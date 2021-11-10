import { useCallback } from 'react'
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import { getMasterMelonFarmerContract, harvestFarm } from '../treat/utils'

const useHarvestFarm = (farmPid: number) => {
  const masterMelonFarmerContract = getMasterMelonFarmerContract(treat)

  const handleHarvest = useCallback(async () => {
    await harvestFarm(masterMelonFarmerContract, farmPid)
  }, [farmPid, masterMelonFarmerContract])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
