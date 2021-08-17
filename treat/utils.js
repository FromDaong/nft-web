import BigNumber from "bignumber.js";
import { decToBn } from "../utils/index";
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
  return (
    treat &&
    treat.contract &&
    treat.contracts.treatNftMinter &&
    treat.contracts.treatNftMinter._address
  );
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

export const getTreatNFTMinterV1Contract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatNFTMinterV1;
};

export const getTreatTradeInContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatTradeIn;
};

export const getTreatMartContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatMart;
};

export const getCreatorMartContract = (treat) => {
  return treat && treat.contracts && treat.contracts.creatorMart;
};

export const getCreatorMinterHelperContract = (treat) => {
  return treat && treat.contracts && treat.contracts.creatorMinterHelper;
};

export const getTreatMarketplaceContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatMarketplace;
};

export const getTreatMarketplaceAddress = (treat) => {
  return (
    treat &&
    treat.contracts &&
    treat.contracts.treatMarketplace &&
    treat.contracts.treatMarketplace._address
  );
};

export const getTreatSupply = async (treat) => {
  return new BigNumber(
    await treat.contracts.treat.methods.totalSupply().call()
  );
};
export const getTreatMartBundleContract = (treat) => {
  return treat && treat.contracts && treat.contracts.treatMartBundle;
};

export const getFreeTreatsContract = (treat) => {
  return treat && treat.contracts && treat.contracts.freeTreats;
};

export const getTreatNftCost = async (treatMartContract, nftId) => {
  return new BigNumber(await treatMartContract.methods.nftCosts(nftId).call());
};

export const getCreatorNftCost = async (creatorMartContract, nftId) => {
  return new BigNumber(
    await creatorMartContract.methods.nftCosts(nftId).call()
  );
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

export const mintCreatorNft = async (
  creatorMartContract,
  account,
  nftId,
  nftCost
) => {
  try {
    return await creatorMartContract.methods
      .redeem(nftId)
      .send({ from: account, value: nftCost });
  } catch (e) {
    return undefined;
  }
};

export const mintManyCreatorNft = async (
  creatorMartContract,
  account,
  nftId,
  nftCost,
  amount
) => {
  try {
    return await creatorMartContract.methods
      .redeemMultiple(nftId, amount)
      .send({ from: account, value: nftCost * amount });
  } catch (e) {
    return undefined;
  }
};

export const createAndAddNFTs = async (
  creatorMartContract,
  account,
  maxSupplys,
  amounts,
  hexData
) => {
  try {
    console.log({ maxSupplys, amounts, hexData });
    const result = await creatorMartContract.methods
      .createAndAddNFTs(maxSupplys, amounts, hexData)
      .send({ from: account, value: 0 });

    return result.events.NFTCreatedAndAdded.returnValues;
  } catch (e) {
    console.log({ e });
    return undefined;
  }
};

export const createNFTs = async (
  creatorMinterHelperContract,
  account,
  maxSupplys
) => {
  try {
    return await creatorMinterHelperContract.methods
      .createTreats(maxSupplys)
      .send({ from: account, value: 0 });
  } catch (e) {
    return undefined;
  }
};

export const addCreatorNft = async (
  creatorMartContract,
  account,
  nftIds,
  nftCosts
) => {
  try {
    return await creatorMartContract.methods
      .addNFT(nftIds, nftCosts)
      .send({ from: account, value: 0 });
  } catch (e) {
    return undefined;
  }
};

export const addCreatorFreeTreat = async (
  creatorMartContract,
  account,
  nftIds
) => {
  try {
    return await creatorMartContract.methods
      .addGiveAwayTreat(nftIds, nftCosts)
      .send({ from: account, value: 0 });
  } catch (e) {
    return undefined;
  }
};

export const mintFreeTreat = async (
  treatMartContract,
  account,
  nftId,
  nftCost
) => {
  try {
    return await treatMartContract.methods
      .redeemFreeTreat(nftId)
      .send({ from: account, value: 0 });
  } catch (e) {
    return undefined;
  }
};

export const mintFreeCreatorTreat = async (
  creatorMartContract,
  account,
  nftId,
  nftCost
) => {
  try {
    return await creatorMartContract.methods
      .redeemFreeTreat(nftId)
      .send({ from: account, value: 0 });
  } catch (e) {
    return undefined;
  }
};

export const getSetIds = async (treatMartContract, setId) => {
  try {
    const txHash = await treatMartContract.methods.getSetIds(setId).call();
    console.log(txHash);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const getCreatorSetIds = async (creatorMartContract, setId) => {
  try {
    const txHash = await creatorMartContract.methods.getSetIds(setId).call();
    console.log(txHash);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const getSetPrice = async (treatMartContract, setId) => {
  try {
    return await treatMartContract.methods.nftSetCosts(setId).call();
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const getCreatorSetPrice = async (creatorMartContract, setId) => {
  try {
    return await creatorMartContract.methods.nftSetCosts(setId).call();
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const redeemSet = async (
  treatMartContract,
  account,
  nftSetId,
  setCost
) => {
  console.log({ mintSetCost: setCost?.toString() });
  try {
    const txHash = await treatMartContract.methods.redeemSet(nftSetId).send({
      from: account,
      value: setCost,
    });
    console.log(txHash);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const redeemCreatorSet = async (
  creatorMartContract,
  account,
  nftSetId,
  setCost
) => {
  console.log({ mintSetCost: setCost?.toString() });
  try {
    const txHash = await creatorMartContract.methods.redeemSet(nftSetId).send({
      from: account,
      value: setCost,
    });
    console.log(txHash);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const redeemV1forV2 = async (
  treatTradeInContract,
  account,
  nftIds,
  amounts
) => {
  console.log({ v1Amounts: amounts?.toString() });
  try {
    const txHash = await treatTradeInContract.methods
      .tradeInMultiple(nftIds, amounts)
      .send({ from: account });
  } catch (e) {
    console.log({ e });
    console.error(e);
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

export const getNftV1Balance = async (treatNFTMinterV1, account, nftId) => {
  try {
    const amount = await treatNFTMinterV1.methods
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

export const addPerformerToMinter = async (
  treatNFTMinter,
  account,
  performerAddress
) => {
  try {
    return await treatNFTMinter.methods
      .addPerformer(performerAddress)
      .send({ from: account, value: 0 });
  } catch (e) {
    console.log({ e });
    console.error(e);
    return undefined;
  }
};

export const isPerformerForMinter = async (
  treatNFTMinter,
  performerAddress
) => {
  try {
    return await treatNFTMinter.methods.isPerformer(performerAddress).call();
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const isAdminForMinter = async (treatNFTMinter, account) => {
  try {
    return await treatNFTMinter.methods.isWhitelistAdmin(account).call();
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const approve = async (treatMart, account) => {
  return await treatMart.methods
    .approve(treatMart.options.address, ethers.constants.MaxUint256)
    .send({ from: account });
};

export const approveMarketplace = async (
  treatNftMinterContract,
  treatMarketplaceAddress,
  account
) => {
  return await treatNftMinterContract.methods
    .setApprovalForAll(treatMarketplaceAddress, true)
    .send({ from: account });
};

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
  try {
    const priceBn = BigNumber.isBigNumber(price) ? price : decToBn(price);
    return await treatMarketplaceContract.methods
      .listOrder(nftId, quantity, "0x" + priceBn.toString(16), 2147483647)
      .send({
        from: account,
      });
  } catch (e) {
    console.log({ error: e });
  }
};

export const purchaseOrder = async (
  treatMarketplaceContract,
  nftId,
  quantity,
  seller,
  account,
  totalPrice
) => {
  console.log({ totalPrice, nftId });
  return await treatMarketplaceContract.methods
    .purchase(nftId, quantity, seller)
    .send({
      from: account,
      value: totalPrice,
    });
};

export const cancelOrder = async (treatMarketplaceContract, nftId, seller) => {
  return await treatMarketplaceContract.methods
    .cancelOrder(nftId, seller)
    .send({
      from: seller,
    });
};

export const getOpenOrdersForNft = async (treatMarketplaceContract, nftId) => {
  try {
    const orders = await treatMarketplaceContract.methods
      .getOpenOrdersForNft(nftId)
      .call();
    return orders;
  } catch (err) {
    console.error(`get orders for nft failed: ${err}`);
  }
};

export const getOpenOrdersForSeller = async (
  treatMarketplaceContract,
  seller
) => {
  try {
    const orders = await treatMarketplaceContract.methods
      .getOpenOrdersForSeller(seller)
      .call();
    console.log({ rawOrders: orders });
    return orders.map((o) => parseInt(o));
  } catch (err) {
    console.error(`get orders for seller failed: ${err}`);
    return [];
  }
};

export const getResaleOrder = async (
  treatMarketplaceContract,
  nftId,
  seller
) => {
  if (!nftId || !seller) {
    return null;
  }

  const rO = await treatMarketplaceContract.methods
    .orderBook(nftId, seller)
    .call();
  console.log({ rO });
  return rO;
};

export const getRemainingBalanceForOrder = async (
  treatMarketplaceContract,
  seller,
  nftId
) => {
  return await treatMarketplaceContract.methods
    .orderBalances(seller, nftId)
    .call();
};

export const getMaxIdForSale = async (treatMarketplaceContract) => {
  return await treatMarketplaceContract.methods.maxTokenId().call();
};
