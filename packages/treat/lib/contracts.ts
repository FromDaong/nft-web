import * as Types from "./types";

import CreatorMartAbi from "./abi/creatormart.json";
import GenericBep20 from "./abi/erc20.json";
import MasterMelonFarmerAbi from "./abi/mastermelonfarmer.json";
import MelonAbi from "./abi/melontoken.json";
import MelonMartAbi from "./abi/melonmart.json";
import MinterPermissionHelperAbi from "./abi/nftminterpermissionhelper.json";
import PancakeLPAbi from "./abi/treatpancakelp.json";
import SubscriberMartAbi from "./abi/subscribermart.json";
import TippingContractAbi from "./abi/tippingcontract.json";
import TotwMinterHelperAbi from "./abi/totwminterhelper.json";
import Treat2Abi from "./abi/treat2.json";
import TreatAbi from "./abi/treat.json";
import TreatMarketReaderAbi from "./abi/treatmarketreader.json";
import TreatMarketplaceAbi from "./abi/treatMarketplace.json";
import TreatMartAbi from "./abi/treatmart.json";
import TreatNFTMinterAbi from "./abi/treatnftminter.json";
import TreatNFTMinterV1Abi from "./abi/treatnftminterv1.json";
import TreatSubscriptionsAbi from "./abi/treatsubscriptions.json";
import TreatTradeInAbi from "./abi/treattradein.json";
import TreatV1ForV2Abi from "./abi/treatv1forv2.json";
import WETHAbi from "./abi/weth.json";
import {Treat} from "..";

export class Contracts implements Types.IContracts {
	web3: any;
	defaultConfirmations: any;
	autoGasMultiplier: any;
	confirmationType: any;
	defaultGas: any;
	defaultGasPrice: any;
	treat: Treat;
	treatNFTMinter: any;
	treatNFTMinterV1: any;
	treatMart: any;
	creatorMart: any;
	subscriberMart: any;
	melonMart: any;
	totwMinterHelper: any;
	treatMarketplace: any;
	treatMarketReader: any;
	treatSubscriptions: any;
	tippingContract: any;
	weth: any;
	treatTradeIn: any;
	treatV1ForV2: any;
	treat2: any;
	melon: any;
	masterMelonFarmer: any;
	v1MasterMelonFarmer: any;
	treatPancakeLP: any;
	minterPermissionHelper: any;
	busdToken: any;
	usdcToken: any;
	blockGasLimit: any;
	notifier: any;

	constructor(provider, networkId, web3, options) {
		this.web3 = web3;
		this.defaultConfirmations = options.defaultConfirmations;
		this.autoGasMultiplier = options.autoGasMultiplier || 1.5;
		this.confirmationType =
			options.confirmationType || Types.ConfirmationType.Confirmed;
		this.defaultGas = options.defaultGas;
		this.defaultGasPrice = options.defaultGasPrice;

		this.treat = new this.web3.eth.Contract(TreatAbi);
		this.treatNFTMinter = new this.web3.eth.Contract(TreatNFTMinterAbi);
		this.treatNFTMinterV1 = new this.web3.eth.Contract(TreatNFTMinterV1Abi);
		this.treatMart = new this.web3.eth.Contract(TreatMartAbi);
		this.creatorMart = new this.web3.eth.Contract(CreatorMartAbi);
		this.subscriberMart = new this.web3.eth.Contract(SubscriberMartAbi);
		this.melonMart = new this.web3.eth.Contract(MelonMartAbi);
		this.totwMinterHelper = new this.web3.eth.Contract(TotwMinterHelperAbi);
		this.treatMarketplace = new this.web3.eth.Contract(TreatMarketplaceAbi);
		this.treatMarketReader = new this.web3.eth.Contract(TreatMarketReaderAbi);
		this.treatSubscriptions = new this.web3.eth.Contract(TreatSubscriptionsAbi);
		this.tippingContract = new this.web3.eth.Contract(TippingContractAbi);
		this.weth = new this.web3.eth.Contract(WETHAbi);
		this.treatTradeIn = new this.web3.eth.Contract(TreatTradeInAbi);
		this.treatV1ForV2 = new this.web3.eth.Contract(TreatV1ForV2Abi);
		this.treat2 = new this.web3.eth.Contract(Treat2Abi);
		this.melon = new this.web3.eth.Contract(MelonAbi);
		this.masterMelonFarmer = new this.web3.eth.Contract(MasterMelonFarmerAbi);
		this.v1MasterMelonFarmer = new this.web3.eth.Contract(MasterMelonFarmerAbi);
		this.treatPancakeLP = new this.web3.eth.Contract(PancakeLPAbi);
		this.minterPermissionHelper = new this.web3.eth.Contract(
			MinterPermissionHelperAbi
		);

		// add generic BEP20 payments
		this.busdToken = new this.web3.eth.Contract(GenericBep20);
		this.usdcToken = new this.web3.eth.Contract(GenericBep20);
	}
}
