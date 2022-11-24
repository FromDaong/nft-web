import BigNumber from "bignumber.js";
import { decToBn } from "@utils/index";
import { ethers } from "ethers";
import Web3 from "web3";

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
  
  
  export const getSubscriberNftCost = async (subscriberMartContract, nftId) => {
    return new BigNumber(
      await subscriberMartContract.methods.nftCosts(nftId).call()
    );
  };
  
  export const getCreatorNftCost = async (creatorMartContract, nftId) => {
    return new BigNumber(
      await creatorMartContract.methods.nftCosts(nftId).call()
    );
  };

  

  
  // user redeems nft
  export const buyMelonNft = async (melonmartContract, account) => {
    try {
      return await melonmartContract.methods.redeem(0).send({ from: account });
    } catch (e) {
      return undefined;
    }
  };
  
  
  // user redeems nft
  export const mintSubNft = async (
    subscriberMartContract,
    account,
    nftId,
    nftCost
  ) => {
    try {
      return await subscriberMartContract.methods
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
  
  export const mintManySubNft = async (
    subscriberMartContract,
    account,
    nftId,
    nftCost,
    amount
  ) => {
    try {
      return await subscriberMartContract.methods
        .redeemMultiple(nftId, amount)
        .send({ from: account, value: nftCost * amount });
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
  
  export const createAndAddMelonNFTs = async (
    melonMartContract,
    account,
    maxSupplys,
    creators,
    hexData
  ) => {
    try {
      const result = await melonMartContract.methods
        .createAndAddNFTs(maxSupplys, creators, hexData)
        .send({ from: account, value: 0 });
  
      return result.events.MelonNFTCreatedAndAdded.returnValues;
    } catch (e) {
      console.error({ e1: e });
      return undefined;
    }
  };
  
  export const createAndAddNFTs = async (
    creatorMartContract,
    account,
    maxSupplys,
    amounts,
    isNotListedFlags,
    hexData,
    returnPromise
  ) => {
    try {
      if (!returnPromise) {
        const result = await creatorMartContract.methods.createAndAddNFTs(
          maxSupplys,
          amounts,
          isNotListedFlags,
          hexData
        );
        return result.events.NFTCreatedAndAdded.returnValues;
      } else
        return creatorMartContract.methods.createAndAddNFTs(
          maxSupplys,
          amounts,
          isNotListedFlags,
          hexData
        );
    } catch (e) {
      console.error({ e });
      return undefined;
    }
  };
  
  export const createAndAddSubscriberNFTs = async (
    subscriberMartContract,
    account,
    maxSupplys,
    amounts,
    isNotListedFlags,
    hexData
  ) => {
    try {
      const result = await subscriberMartContract.methods
        .createAndAddNFTs(maxSupplys, amounts, isNotListedFlags, hexData)
        .send({ from: account, value: 0 });
  
      return result.events.NFTCreatedAndAdded.returnValues;
    } catch (e) {
      console.error({ e });
      return undefined;
    }
  };
  

  
  export const addSubscriberNft = async (
    subscriberMartContract,
    account,
    nftIds,
    nftCosts
  ) => {
    try {
      return await subscriberMartContract.methods
        .addNFT(nftIds, nftCosts)
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
      console.error({ e });
      return undefined;
    }
  

  };
  

  
  export const getSubscriberSetIds = async (subscriberMartContract, setId) => {
    try {
      const txHash = await subscriberMartContract.methods.getSetIds(setId).call();
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };
  
  export const getCreatorSetIds = async (creatorMartContract, setId) => {
    try {
      const txHash = await creatorMartContract.methods.getSetIds(setId).call();
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };
  
  export const getSubscriberSetPrice = async (subscriberMartContract, setId) => {
    try {
      return await subscriberMartContract.methods.nftSetCosts(setId).call();
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
    
  export const redeemSubscriberSet = async (
    subscriberMartContract,
    account,
    nftSetId,
    setCost
  ) => {
    try {
      const txHash = await subscriberMartContract.methods
        .redeemSet(nftSetId)
        .send({
          from: account,
          value: setCost,
        });
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
    try {
      const txHash = await creatorMartContract.methods.redeemSet(nftSetId).send({
        from: account,
        value: setCost,
      });
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };
  
  export const getIsGiveAwayNft = async (creatorMart, nftId) => {
    try {
      return await creatorMart.methods.isGiveAwayCard(nftId).call();
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };
  
  export const getIsGiveAwaySubscriberNft = async (subscriberMart, nftId) => {
    try {
      return await subscriberMart.methods.isGiveAwayCard(nftId).call();
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };
  
  export const addPerformerToMinter = async (
    minterPermissionHelper,
    account,
    performerAddress
  ) => {
    try {
      return await minterPermissionHelper.methods
        .addPerformer(performerAddress)
        .send({ from: account, value: 0 });
    } catch (e) {
      console.error({ e });
      console.error(e);
      return undefined;
    }
  };
    
  export const stakeFarm = async (
    masterMelonFarmerContract,
    pid,
    amount,
    account
  ) => {
    // const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
    const value = Web3.utils.toWei(amount.toString());
    if (pid === 0) {
      const tx = await masterMelonFarmerContract.methods
        .enterStaking(value)
        .send({ from: account });
  
      return tx;
    }
  
    const tx = await masterMelonFarmerContract.methods
      .deposit(pid, value)
      .send({ from: account });
  
    return tx;
  };
  
  export const getStaked = async (masterMelonFarmerContract, pid, account) => {
    try {
      const { amount } = await masterMelonFarmerContract.methods
        .userInfo(pid, account)
        .call();
      return new BigNumber(amount);
    } catch {
      return new BigNumber(0);
    }
  };
  
  export const getPendingMelons = async (
    masterMelonFarmerContract,
    pid,
    account
  ) => {
    try {
      const amount = await masterMelonFarmerContract.methods
        .pendingMelon(pid, account)
        .call();
  
      return new BigNumber(amount);
    } catch {
      return new BigNumber(0);
    }
  };
  
  export const unstakeFarm = async (
    masterMelonFarmerContract,
    pid,
    amount,
    account
  ) => {
    // const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
    const value = Web3.utils.toWei(amount.toString());
    if (pid === 0) {
      const tx = await masterMelonFarmerContract.methods
        .leaveStaking(value)
        .send({ from: account });
  
      return tx;
    }
  
    const tx = await masterMelonFarmerContract.methods
      .withdraw(pid, value)
      .send({ from: account });
  
    return tx;
  };
  
  export const harvestFarm = async (masterMelonFarmerContract, pid, account) => {
    if (pid === 0) {
      const tx = await masterMelonFarmerContract.methods
        .leaveStaking("0")
        .send({ from: account });
  
      return tx;
    }
  
    const tx = await masterMelonFarmerContract.methods
      .deposit(pid, "0")
      .send({ from: account });
  
    return tx;
  };
  