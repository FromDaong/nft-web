import BigNumber from "bignumber.js";
import { decToBn } from '../utils/index'
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
  return treat && treat.contract && treat.contracts.treatNftMinter && treat.contracts.treatNftMinter._address;
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

export const getFreeTreatsContract = (treat) => {
  return treat && treat.contracts && treat.contracts.freeTreats;
};

export const getTreatMarketplaceContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatMarketplace;
}

export const getTreatMarketplaceAddress = (treat) => {
  return treat && treat.contracts && treat.contracts.treatMarketplace && treat.contracts.treatMarketplace._address;
}

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
  try {
    return await treatmartContract.methods
      .redeem(nftId)
      .send({ from: account, value: nftCost });
  } catch (e) {
    return undefined;
  }
};

export const mintFreeTreat = async (
  freeTreatContract,
  account,
  nftId,
  nftCost
) => {
  try {
    return await freeTreatContract.methods
      .redeem(nftId)
      .send({ from: account, value: 0 });
  } catch (e) {
    return undefined;
  }
};

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
  return await treatMart.methods
    .approve(treatMart.options.address, ethers.constants.MaxUint256)
    .send({ from: account });
};

export const approveMarketplace = async (treatNftMinterContract, treatMarketplaceAddress, account) => {
  return await treatNftMinterContract.methods
                                     .setApprovalForAll(treatMarketplaceAddress, true)
                                     .send({from: account})
}

export const transferNfts = async (treatMart, from, to, id, amount) => {
  return await treatMart.methods
    .safeTransferFrom(from, to, id, amount, "0x0")
    .send({ from: from });
};

export const listOrder = async (
  treatMarketplaceContract,
  account,
  nftId,
  quantity,
  price,
  expiresDate
) => {
  const priceBn = decToBn(price);
  const unixTimestampSecs = Math.floor(new Date(expiresDate).getTime() /1000);
  return await treatMarketplaceContract.methods
    .listOrder(nftId, quantity, priceBn, unixTimestampSecs)
    .send({
      from: account,
    });
};

export const purchaseOrder = async (
  treatMarketplaceContract,
  nftId,
  quantity,
  seller,
  account,
  totalPrice
) => {
  return await treatMarketplaceContract.methods.purchase(nftId, quantity, seller).send({
    from: account,
    value: totalPrice,
  });
};

export const cancelOrder = async (treatMarketplaceContract, nftId, seller) => {
  return await treatMarketplaceContract.methods.cancelOrder(nftId, seller).send({
    from: seller,
  });
};

export const getOpenOrdersForNft = async (treatMarketplaceContract, nftId) => {
  return await treatMarketplaceContract.methods.getOpenOrdersForNft(nftId).call();
};

export const getOpenOrdersForSeller = async (treatMarketplaceContract, seller) => {
  return await treatMarketplaceContract.methods.getOpenOrdersForNft(seller).call();
};

export const getResaleOrder = async (treatMarketplaceContract, nftId, seller) => {
  if(!nftId || !seller) {
    return null
  }
  
  return await treatMarketplaceContract.methods.orderBook(nftId, seller).call();
}

export const getRemainingBalanceForOrder = async (treatMarketplaceContract, seller, nftId) => {
  return await treatMarketplaceContract.methods
                                       .orderBalances(seller, nftId)
                                       .call()
}

export const getMaxIdForSale = async (treatMarketplaceContract) => {
  return await treatMarketplaceContract.methods.maxTokenId().call()
}