import BigNumber from "bignumber.js";
import { ethers } from "ethers";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
};

export const getTreatAddress = (treat) => {
  return treat && treat.treatAddress;
};

export const getTreatNFTMinterAddress = (treat) => {
  return treat && treat.treatNFTMinterAddress;
};

export const getWethContract = (treat) => {
  return treat && treat.contracts && treat.contracts.weth;
};

export const getTreatContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treat;
};

export const getTreatNFTMinterContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatNFTMinter;
};

export const getTreatMartContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatMart;
};

export const getTreatMartBundleContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatMartBundle;
};

export const getFreeTreatsContract = (treat) => {
  return treat && treat.contracts && treat.contracts.freeTreats;
};

export const getTreatSupply = async (treat) => {
  return new BigNumber(
    await treat.contracts.treat.methods.totalSupply().call()
  );
};

export const getTreatNftCost = async (treatMartContract, nftId) => {
  return new BigNumber(await treatMartContract.methods.nftCosts(nftId).call());
};

// user redeems nft
export const mintNft = async (treatmartContract, account, nftId, nftCost) => {
  console.log({mintCost: nftCost})
  console.log({mintCostBn: new BigNumber(nftCost)})
  try {
    return await treatmartContract.methods
      .redeem(nftId)
      .send({ from: account, value: nftCost });
  } catch (e) {
    return undefined;
  }
};


export const mintFreeTreat = async (freeTreatContract, account, nftId, nftCost) => {
  try {
    return await freeTreatContract.methods
      .redeem(nftId)
      .send({ from: account, value: 0 });
  } catch (e) {
    return undefined;
  }
};

export const getSetIds = async (treatMartBundleContract, setId) => {
  try {
    const txHash = await treatMartBundleContract.methods 
                                          .getSetIds(setId)
                                          .call();
    console.log(txHash)
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export const getSetPrice = async (treatMartBundleContract, setId) => {
   try {
    return await treatMartBundleContract.methods 
                                          .nftSetCosts(setId)
                                          .call();
  } catch (e) {
    console.error(e);
    return undefined;
  } 
}

export const redeemSet = async (treatMartBundleContract, account, nftSetId, setCost) => {
  console.log({mintSetCost: setCost?.toString()})
  try {
    const txHash = await treatMartBundleContract.methods
                         .redeemSet(nftSetId)
                         .send({
                           from: account,
                           value: setCost
                         });
    console.log(txHash);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export const getNftBalance = async (treatNFTMinter, account, nftId) => {
  try {
    const amount = await treatNFTMinter.methods
      .balanceOf(account, nftId)
      .call();
    return new BigNumber(amount);
  } catch {
    return new BigNumber(0);
  }
};

export const getNftCreator = async (treatNFTMinter, nftId) => {
  try {
    const modelAddress = await treatNFTMinter.methods.tokenModels(nftId).call();
    return new modelAddress();
  } catch {
    return new treatMart.address();
  }
};

export const getNftMaxSupply = async (treatNFTMinter, nftId) => {
  try {
    const amount = await treatNFTMinter.methods.tokenMaxSupply(nftId).call();
    console.log({ amount });
    if (amount) return new BigNumber(amount);
    return null;
  } catch {
    return null;
  }
};

export const getNftTotalSupply = async (treatNFTMinter, nftId) => {
  try {
    const amount = await treatNFTMinter.methods.tokenSupply(nftId).call();
    return new BigNumber(amount);
  } catch {
    return new BigNumber(0);
  }
};

export const approve = async (treatMart, account) => {
  return treatMart.methods
    .approve(treatMart.options.address, ethers.constants.MaxUint256)
    .send({ from: account });
};

export const transferNfts = async (treatMart, from, to, id, amount) => { 
  return await treatMart.methods
  .safeTransferFrom(from, to, id, amount, '0x0')
  .send({ from: from})
}