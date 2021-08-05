import { Contract } from 'web3-eth-contract'

export const getIsApprovedForAll = async (
    treatNftMinterContract: Contract,
    treatMarketplaceAddress: string,
    account: string
) : Promise<boolean> => {
      try {
    const allowance: boolean = await treatNftMinterContract.methods
      .isApprovedForAll(account, treatMarketplaceAddress)
      .call()
    return allowance
  } catch (e) {
    return false
  }
}
