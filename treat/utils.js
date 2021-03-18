import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getTreatAddress = (treat) => {
  return treat && treat.treatAddress
}

export const getTreatNFTMinterAddress = (treat) => {
  return treat && treat.treatNFTMinterAddress
}

export const getWethContract = (treat) => {
  return treat && treat.contracts && treat.contracts.weth
}

export const getTreatContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treat
}

export const getTreatNFTMinterContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatNFTMinter
}

export const getTreatMartContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatMart
}

export const getTreatSupply = async (treat) => {
  return new BigNumber(await treat.contracts.treat.methods.totalSupply().call())
}

export const getTreatNftCost = async (treatMartContract, nftId) => {
  return new BigNumber(await treatMartContract.methods.cardCosts(nftId).call())
}

// user redeems nft
export const mintNft = async (treatmartContract, account, nftId, nftCost) => {
  return await treatmartContract.methods.redeem(nftId)
    .send({ from: account, value: nftCost})
}

export const getNftBalance = async (treatNFTMinter, account, nftId) => {
  try {
    const amount = await treatNFTMinter.methods
      .balanceOf(account, nftId)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const getNftMaxSupply  = async (treatNFTMinter, nftId) => {
  try {
    const amount = await treatNFTMinter.methods
      .tokenMaxSupply(nftId)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const getNftTotalSupply  = async (treatNFTMinter, nftId) => {
  try {
    const amount = await treatNFTMinter.methods
      .tokenSupply(nftId)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const approve = async (treatMart, account) => {
  return treatMart.methods
    .approve(treatMart.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}