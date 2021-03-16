import { Contract } from 'web3-eth-contract'

export const getIsApprovedForAll = async (
    smolStudioContract: Contract,
    smolMuseumAddress: string,
    account: string
) : Promise<boolean> => {
      try {
    const allowance: boolean = await smolStudioContract.methods
      .isApprovedForAll(account, smolMuseumAddress)
      .call()
    return allowance
  } catch (e) {
    return false
  }
}
