import BigNumber from "bignumber.js";
import {decToBn} from "../../utils/index";
import {ethers} from "ethers";
import Web3 from "web3";

BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 80,
});

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

export const getTreat2Contract = (treat) => {
	return treat && treat.contracts && treat.contracts.treat2;
};

export const getTreatPancakeLPContract = (treat) => {
	return treat && treat.contracts && treat.contracts.treatPancakeLP;
};

export const getMelonContract = (treat) => {
	return treat && treat.contracts && treat.contracts.melon;
};

export const getMasterMelonFarmerContract = (treat) => {
	return treat && treat.contracts && treat.contracts.masterMelonFarmer;
};
export const getV1MasterMelonFarmerContract = (treat) => {
	return treat && treat.contracts && treat.contracts.v1MasterMelonFarmer;
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

export const getTreatV1ForV2Contract = (treat) => {
	return treat && treat.contracts && treat.contracts.treatV1ForV2;
};

export const getTreatMartContract = (treat) => {
	return treat && treat.contracts && treat.contracts.treatMart;
};

export const getSubscriberMartContract = (treat) => {
	return treat && treat.contracts && treat.contracts.subscriberMart;
};

export const getCreatorMartContract = (treat) => {
	return treat && treat.contracts && treat.contracts.creatorMart;
};

export const getMelonMartContract = (treat) => {
	return treat && treat.contracts && treat.contracts.melonMart;
};

export const getCreatorMinterHelperContract = (treat) => {
	return treat && treat.contracts && treat.contracts.creatorMinterHelper;
};

export const getTotwMinterHelperContract = (treat) => {
	return treat && treat.contracts && treat.contracts.totwMinterHelper;
};

export const getMinterPermissionHelperContract = (treat) => {
	return treat && treat.contracts && treat.contracts.minterPermissionHelper;
};

export const getTreatMarketplaceContract = (treat) => {
	return treat && treat.contracts && treat.contracts.treatMarketplace;
};

export const getTreatMarketReaderContract = (treat) => {
	return treat && treat.contracts && treat.contracts.treatMarketReader;
};

export const getTreatSubscriptionContract = (treat) => {
	return treat && treat.contracts && treat.contracts.treatSubscriptions;
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

export const getSubCost = async (treatSubscriptionContract, creatorAddress) => {
	return new BigNumber(
		await treatSubscriptionContract.methods
			.creatorSubscriptionCost(creatorAddress)
			.call()
	);
};

export const isSubscribed = async (
	treatSubscriptionContract,
	subscriberAddress,
	creatorAddress
) => {
	return await treatSubscriptionContract.methods
		.getIsSubscribedNow(subscriberAddress, creatorAddress)
		.call();
};

export const isSubLocked = async (
	treatSubscriptionContract,
	subscriberAddress,
	creatorAddress
) => {
	return await treatSubscriptionContract.methods
		.hasCreatorLockedSubscriber(creatorAddress, subscriberAddress)
		.call();
};

export const lockSub = async (
	treatSubscriptionContract,
	account,
	subscriberAddress
) => {
	try {
		const result = await treatSubscriptionContract.methods
			.lockSubscriber(subscriberAddress)
			.send({from: account, value: 0});
		return result.events.SubscriberLocked.returnValues;
	} catch (e) {
		return undefined;
	}
};

export const unlockSub = async (
	treatSubscriptionContract,
	account,
	subscriberAddress
) => {
	try {
		const result = await treatSubscriptionContract.methods
			.unLockSubscriber(subscriberAddress)
			.send({from: account, value: 0});
		return result.events.SubscriberUnlocked.returnValues;
	} catch (e) {
		return undefined;
	}
};

export const subscribeTo = async (
	treatSubscriptionContract,
	account,
	creatorAddress,
	subCost,
	totalSubUnits
) => {
	try {
		const result = await treatSubscriptionContract.methods
			.subscribe(creatorAddress, totalSubUnits)
			.send({from: account, value: subCost});
		return result.events.Subscribed.returnValues;
	} catch (e) {
		return undefined;
	}
};

export const editSub = async (treatSubscriptionContract, account, subCost) => {
	try {
		const result = await treatSubscriptionContract.methods
			.setSubscriptionCost(subCost)
			.send({from: account, value: 0});
		return result.events.SubscriptionEdited.returnValues;
	} catch (e) {
		return undefined;
	}
};

// user redeems nft
export const buyMelonNft = async (melonmartContract, account) => {
	try {
		return await melonmartContract.methods.redeem(0).send({from: account});
	} catch (e) {
		return undefined;
	}
};

export const mintNft = async (treatmartContract, account, nftId, nftCost) => {
	try {
		return await treatmartContract.methods
			.redeem(nftId)
			.send({from: account, value: nftCost});
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
			.send({from: account, value: nftCost});
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
			.send({from: account, value: nftCost});
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
			.send({from: account, value: nftCost * amount});
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
			.send({from: account, value: nftCost * amount});
	} catch (e) {
		return undefined;
	}
};

export const createBulkTotwNFTs = async (
	totwMinterHelperContract,
	account,
	maxSupplys,
	creatorAddress
) => {
	try {
		const result = await totwMinterHelperContract.methods
			.createTreats(maxSupplys, creatorAddress)
			.send({from: account, value: 0});

		return result.events.TotwNftsCreated.returnValues;
	} catch (e) {
		console.error({e});
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
			.send({from: account, value: 0});

		return result.events.MelonNFTCreatedAndAdded.returnValues;
	} catch (e) {
		console.error({e1: e});
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
		console.error({e});
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
			.send({from: account, value: 0});

		return result.events.NFTCreatedAndAdded.returnValues;
	} catch (e) {
		console.error({e});
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
			.send({from: account, value: 0});
	} catch (e) {
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
			.send({from: account, value: 0});
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
			.send({from: account, value: 0});
	} catch (e) {
		console.error({e});
		return undefined;
	}
};

export const addSubscriberFreeTreat = async (
	subscriberMartContract,
	account,
	nftIds
) => {
	try {
		return await subscriberMartContract.methods
			.addGiveAwayTreat(nftIds)
			.send({from: account, value: 0});
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
			.addGiveAwayTreat(nftIds)
			.send({from: account, value: 0});
	} catch (e) {
		return undefined;
	}
};

export const mintFreeTreat = async (treatMartContract, account, nftId) => {
	try {
		return await treatMartContract.methods
			.redeemFreeTreat(nftId)
			.send({from: account, value: 0});
	} catch (e) {
		return undefined;
	}
};

export const mintFreeSubscriberTreat = async (
	subscriberMartContract,
	account,
	nftId
) => {
	try {
		return await subscriberMartContract.methods
			.redeemFreeTreat(nftId)
			.send({from: account, value: 0});
	} catch (e) {
		return undefined;
	}
};

export const mintFreeCreatorTreat = async (
	creatorMartContract,
	account,
	nftId
) => {
	try {
		return await creatorMartContract.methods
			.redeemFreeTreat(nftId)
			.send({from: account, value: 0});
	} catch (e) {
		return undefined;
	}
};

export const getSetIds = async (treatMartContract, setId) => {
	try {
		await treatMartContract.methods.getSetIds(setId).call();
	} catch (e) {
		console.error(e);
		return undefined;
	}
};

export const getSubscriberSetIds = async (subscriberMartContract, setId) => {
	try {
		await subscriberMartContract.methods.getSetIds(setId).call();
	} catch (e) {
		console.error(e);
		return undefined;
	}
};

export const getCreatorSetIds = async (creatorMartContract, setId) => {
	try {
		await creatorMartContract.methods.getSetIds(setId).call();
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

export const redeemSet = async (
	treatMartContract,
	account,
	nftSetId,
	setCost
) => {
	try {
		await treatMartContract.methods.redeemSet(nftSetId).send({
			from: account,
			value: setCost,
		});
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
		await subscriberMartContract.methods.redeemSet(nftSetId).send({
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
		await creatorMartContract.methods.redeemSet(nftSetId).send({
			from: account,
			value: setCost,
		});
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
	try {
		await treatTradeInContract.methods
			.tradeInMultiple(nftIds, amounts)
			.send({from: account});
	} catch (e) {
		console.error({e});
		console.error(e);
		return undefined;
	}
};

export const tradeInV1ForV2 = async (treatV1ForV2Contract, account, amount) => {
	try {
		await treatV1ForV2Contract.methods
			.tradeInTreat(amount)
			.send({from: account});
	} catch (e) {
		console.error({e});
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

export const getNftCreator = async (treatNFTMinter, nftId) => {
	try {
		const modelAddress = await treatNFTMinter.methods.creators(nftId).call();
		return new modelAddress();
	} catch {
		return treatNFTMinter.address;
	}
};

export const getCreatorReferrer = async (treatNFTMinter, creatorAddress) => {
	try {
		const refAddress = await treatNFTMinter.methods
			.referrers(creatorAddress)
			.call();
		return new refAddress();
	} catch {
		return treatNFTMinter.address;
	}
};

export const addReferrerToMinter = async (
	treatNFTMinter,
	account,
	performerAddress,
	referrerAddress
) => {
	try {
		return await treatNFTMinter.methods
			.addTreatReferrer(performerAddress, referrerAddress)
			.send({from: account, value: 0});
	} catch (e) {
		console.error({e});
		console.error(e);
		return undefined;
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
	minterPermissionHelper,
	account,
	performerAddress
) => {
	try {
		return await minterPermissionHelper.methods
			.addPerformer(performerAddress)
			.send({from: account, value: 0});
	} catch (e) {
		console.error({e});
		console.error(e);
		return undefined;
	}
};

export const removePerformerFromMinter = async (
	treatNFTMinter,
	account,
	performerAddress
) => {
	try {
		return await treatNFTMinter.methods
			.removePerformer(performerAddress)
			.send({from: account, value: 0});
	} catch (e) {
		console.error({e});
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
		.send({from: account});
};

export const approveTreatOneForTwo = async (treat, treatV1ForV2, account) => {
	return await treat.methods
		.approve(treatV1ForV2.options.address, ethers.constants.MaxUint256)
		.send({from: account});
};

export const approveContract = async (treat, contractAddress, account) => {
	return await treat.methods
		.approve(contractAddress, ethers.constants.MaxUint256)
		.send({from: account});
};

export const hasApprovedTreatOneForTwoContract = async (
	treat,
	treatV1ForV2,
	account
) => {
	return await treat.methods
		.allowance(account, treatV1ForV2.options.address)
		.call();
};

// has approved
export const hasApprovedContract = async (treat, address, account) => {
	return await treat.methods.allowance(account, address).call();
};

export const approveMarketplace = async (
	treatNftMinterContract,
	treatMarketplaceAddress,
	account
) => {
	return await treatNftMinterContract.methods
		.setApprovalForAll(treatMarketplaceAddress, true)
		.send({from: account});
};

export const transferNfts = async (treatMart, from, to, id, amount) => {
	return await treatMart.methods
		.safeTransferFrom(from, to, id, amount, "0x0")
		.send({from: from});
};

export const listOrder = async (
	treatMarketplaceContract,
	account,
	nftId,
	quantity,
	price
) => {
	try {
		const priceBn = BigNumber.isBigNumber(price) ? price : decToBn(price);
		return await treatMarketplaceContract.methods
			.listOrder(nftId, quantity, "0x" + priceBn.toString(16), 2147483647)
			.send({
				from: account,
			});
	} catch (e) {
		console.error({error: e});
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

export const getNftRangeBalance = async (
	treatMarketReaderContract,
	account,
	startNftId,
	endNftId
) => {
	try {
		const amount = await treatMarketReaderContract.methods
			.readNftRangeBalance(account, startNftId, endNftId)
			.call();
		return new BigNumber(amount);
	} catch {
		return new BigNumber(0);
	}
};

export const getAllOrdersForSeller = async (
	treatMarketReaderContract,
	seller
) => {
	try {
		const orders = await treatMarketReaderContract.methods
			.readAllOrdersForSeller(seller)
			.call();

		return orders.map((o) => parseInt(o));
	} catch (err) {
		console.error(`get orders for seller failed: ${err}`);
		return [];
	}
};

export const getAllOrdersForNft = async (treatMarketReaderContract, nftId) => {
	try {
		const orders = await treatMarketReaderContract.methods
			.readAllOrdersForNft(nftId)
			.call();

		return orders.map((o) => parseInt(o));
	} catch (err) {
		console.error(`get orders for seller failed: ${err}`);
		return [];
	}
};

export const getOrdersInfoForNftRange = async (
	treatMarketReaderContract,
	startNftId,
	endNftId
) => {
	try {
		const orders = await treatMarketReaderContract.methods
			.readOrderPricesForNftRange(startNftId, endNftId)
			.call();

		const x = orders.sellers.map((o, i) => {
			return {
				seller: o,
				price: orders.prices[i],
				nftId: Number(orders.nftIds[i]),
				listDate: orders.listDates[i],
			};
		});

		return x;
	} catch (err) {
		console.error(`get orders for seller failed: ${err}`);
		return [];
	}
};

export const approveTreatStaking = async (
	treat2,
	masterMelonFarmer,
	account
) => {
	return await treat2.methods
		.approve(masterMelonFarmer.options.address, ethers.constants.MaxUint256)
		.send({from: account});
};

export const approveTreatPancakeLPStaking = async (
	treatPancakeLP,
	masterMelonFarmer,
	account
) => {
	return await treatPancakeLP.methods
		.approve(masterMelonFarmer.options.address, ethers.constants.MaxUint256)
		.send({from: account});
};

export const hasApprovedTreatStaking = async (
	treat2,
	masterMelonFarmer,
	account
) => {
	return treat2.methods
		.allowance(account, masterMelonFarmer.options.address)
		.call();
};

export const hasApprovedTreatPancakeLPStaking = async (
	treatPancakeLP,
	masterMelonFarmer,
	account
) => {
	return treatPancakeLP.methods
		.allowance(account, masterMelonFarmer.options.address)
		.call();
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
		const tx = await masterMelonFarmerContract.enterStaking(value, {
			from: account,
		});

		return tx;
	}

	const tx = await masterMelonFarmerContract
		.deposit(pid, value)
		.send({from: account});

	return tx;
};

export const getStaked = async (masterMelonFarmerContract, pid, account) => {
	try {
		const {amount} = await masterMelonFarmerContract.methods
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
			.send({from: account});

		return tx;
	}

	const tx = await masterMelonFarmerContract.methods
		.withdraw(pid, value)
		.send({from: account});

	return tx;
};

export const harvestFarm = async (masterMelonFarmerContract, pid, account) => {
	if (pid === 0) {
		const tx = await masterMelonFarmerContract.methods
			.leaveStaking("0")
			.send({from: account});

		return tx;
	}

	const tx = await masterMelonFarmerContract.methods
		.deposit(pid, "0")
		.send({from: account});

	return tx;
};
