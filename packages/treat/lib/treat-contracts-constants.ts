import BigNumber from "bignumber.js";
export const SUBTRACT_GAS_LIMIT = 100000;

const ONE_MINUTE_IN_SECONDS = new BigNumber(60);
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60);
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24);
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365);

export const INTEGERS = {
	ONE_MINUTE_IN_SECONDS,
	ONE_HOUR_IN_SECONDS,
	ONE_DAY_IN_SECONDS,
	ONE_YEAR_IN_SECONDS,
	ZERO: new BigNumber(0),
	ONE: new BigNumber(1),
	ONES_31: new BigNumber("4294967295"), // 2**32-1
	ONES_127: new BigNumber("340282366920938463463374607431768211455"), // 2**128-1
	ONES_255: new BigNumber(
		"115792089237316195423570985008687907853269984665640564039457584007913129639935"
	), // 2**256-1
	INTEREST_RATE_BASE: new BigNumber("1000000000000000000"),
};

export const addressMap = {
	TREAT: "0x306403fEFcA4675f8928B4999d374dBACFeABaA9",
};

// networkId -> contractId
// We must provide in both HEX and Decimal in each object.
export const contractAddresses = {
	treatV1Token: {
		56: "0xac0c7d9b063ed2c0946982ddb378e03886c064e6",
		"0x38": "0xac0c7d9b063ed2c0946982ddb378e03886c064e6",
		97: "0x8fF95CE7984410fda65A08646E16FC7BaC6bea7b",
		"0x61": "0x8fF95CE7984410fda65A08646E16FC7BaC6bea7b",
	},
	treatToken: {
		56: "0x01bd7acb6fF3B6Dd5aefA05CF085F2104f3fC53F",
		"0x38": "0x01bd7acb6fF3B6Dd5aefA05CF085F2104f3fC53F",
		97: "0xdE637209AC5E70fA2F2B6C86684E860fd474A33E",
		"0x61": "0xdE637209AC5E70fA2F2B6C86684E860fd474A33E",
	},
	weth: {
		56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
		"0x38": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
		97: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
		"0x61": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
	},
	busdToken: {
		56: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
		"0x38": "0xe9e7cea3dedca5984780bafc599bd69add087d56", // not correct testnet contract
	},
	usdcToken: {
		56: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
		"0x38": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // not correct testnet contract
	},
	melonToken: {
		56: "0x045F789e383B23076e7339aeBCab71D38dAD0f8A",
		"0x38": "0x045F789e383B23076e7339aeBCab71D38dAD0f8A",
		97: "0x17604Afe531536F97c320e998a724b50FAc848B6",
		"0x61": "0x17604Afe531536F97c320e998a724b50FAc848B6",
	},

	treatNFTMinter: {
		56: "0x36f8f51f65fe200311f709b797baf4e193dd0b0d",
		"0x38": "0x36f8f51f65fe200311f709b797baf4e193dd0b0d",
		97: "0xe7F8059Ac6f4A230C0c08aDfa9e09A2156236239",
		"0x61": "0xe7F8059Ac6f4A230C0c08aDfa9e09A2156236239",
	},
	treatNFTMinterV1: {
		56: "0xde39d0b9a93dcd541c24e80c8361f362aab0f213",
		"0x38": "0xde39d0b9a93dcd541c24e80c8361f362aab0f213",
		97: "0xde83588bdB26c91B642C779a7C41722ca2364563",
		"0x61": "0xde83588bdB26c91B642C779a7C41722ca2364563",
	},
	treatResaleMarketplaceMinter: {
		56: "0xA38978E839c08046FA80B0fee55736253Ab3B8a3",
		"0x38": "0xA38978E839c08046FA80B0fee55736253Ab3B8a3",
		// NEW CONTRACT ^
		// 56: "0x6991a8e77a1a4ea5819da2c5a65a3524259ca66e",
		// "0x38": "0x6991a8e77a1a4ea5819da2c5a65a3524259ca66e",
		97: "0xB70EC99ECBF67453F315635000d20bA28aC35132",
		"0x61": "0xB70EC99ECBF67453F315635000d20bA28aC35132",
	},

	creatorMart: {
		56: "0xE965D19FD021355fc85f4Cdcc856C018274cACF8",
		"0x38": "0xE965D19FD021355fc85f4Cdcc856C018274cACF8",
		97: "0x76936371d434Ec96803C4c2983b9AF6ad2f2678c",
		"0x61": "0x76936371d434Ec96803C4c2983b9AF6ad2f2678c",
	},
	subscriberMart: {
		56: "0x16d68Fe18D8b7dFF8A8626c90AE5d2d949A7C7d5",
		"0x38": "0x16d68Fe18D8b7dFF8A8626c90AE5d2d949A7C7d5",
		97: "0x33Cc2629bcc81f87FBF75a5428B5696f53cEb452",
		"0x61": "0x33Cc2629bcc81f87FBF75a5428B5696f53cEb452",
	},
	totmMart: {
		56: "0xE6efd1c80e51C89506Eb91ed6C38CdAa657b8f46",
		"0x38": "0xE6efd1c80e51C89506Eb91ed6C38CdAa657b8f46",
		97: "0x250a0463D2A1C774Bbad4D667afda7ac6A38ab5C",
		"0x61": "0x250a0463D2A1C774Bbad4D667afda7ac6A38ab5C",
	},
	melonMart: {
		56: "0xC3AE43eD146ffD40FC94f35Cf59F558f644955c9",
		"0x38": "0xC3AE43eD146ffD40FC94f35Cf59F558f644955c9",
		97: "0x1D6d323070cA13235D1D7FC7Ad78A36aE62c8725",
		"0x61": "0x1D6d323070cA13235D1D7FC7Ad78A36aE62c8725",
	},

	treatTradeIn: {
		56: "0xE0f5df4915242E4C4C06D2964Eda53C448fec442",
		"0x38": "0xE0f5df4915242E4C4C06D2964Eda53C448fec442",
		97: "0x34289187D887486cD1C98d6253621ae6ADC7cb3e",
		"0x61": "0x34289187D887486cD1C98d6253621ae6ADC7cb3e",
	},
	/**
	 * @description Gives you access to `readAllOrdersForSeller(address sellerAddress)` and `readAllOrdersForNft(uint256 nftId)` and `readOrderPricesForNftRange(uint256 nftId, uint256 endNftId)`
	 */
	treatMarketReader: {
		56: "0xFa6C813B1f2e75019dDB81aB518108571c737B22",
		"0x38": "0xFa6C813B1f2e75019dDB81aB518108571c737B22",
		97: "0x28F1526838868aA83c9a90B054873d15BB88FB6F",
		"0x61": "0x28F1526838868aA83c9a90B054873d15BB88FB6F",
	},
	/**
	 * @deprecated
	 * TODO: Refer to the ABI to get docs for subscriptions
	 */
	treatSubscriptions: {
		56: "0x0d5FA8001E1193E03A66f9C969F2419450b0909d",
		"0x38": "0x0d5FA8001E1193E03A66f9C969F2419450b0909d",
		97: "0xe8b1eaa85c05FDF13FeCc6358302b035B000f6B3",
		"0x61": "0xe8b1eaa85c05FDF13FeCc6358302b035B000f6B3",
	},

	masterMelonFarmer: {
		56: "0xFe01fd1c890C3de7A749Bf135218f1aA869d2db7",
		"0x38": "0xFe01fd1c890C3de7A749Bf135218f1aA869d2db7",
		97: "0xaB6AcF99Da8f510Db0deB8D0d0B04dF93BeA7Df2",
		"0x61": "0xaB6AcF99Da8f510Db0deB8D0d0B04dF93BeA7Df2",
	},
	treatV1ForV2: {
		56: "0xcF9fF354f29334E6Beeb2245051846801aE73f8F",
		"0x38": "0xcF9fF354f29334E6Beeb2245051846801aE73f8F",
		97: "0xD99F67F5604D19371df6e599085719a365711d56",
		"0x61": "0xD99F67F5604D19371df6e599085719a365711d56",
	},
	treatPancakeLP: {
		56: "0xfa0c171aFE708b97ad61a136cB0499CDb1b7B10e",
		"0x38": "0xfa0c171aFE708b97ad61a136cB0499CDb1b7B10e",
		97: "0x5278654c3c1d1666c909f33c80cea3e555838d88",
		"0x61": "0x5278654c3c1d1666c909f33c80cea3e555838d88",
	},

	creatorMinterHelper: {
		56: "0x66685ccCfD3c1C65220973CDb5E33f706e1F0537",
		"0x38": "0x66685ccCfD3c1C65220973CDb5E33f706e1F0537",
		97: "0x0119b60DB932306Bea68414fbFb0ef4d9769AA2b",
		"0x61": "0x0119b60DB932306Bea68414fbFb0ef4d9769AA2b",
	},
	totwMinterHelper: {
		56: "0x045dAEa9536ae0c9A119B8a179C0Efb491e5cb1D",
		"0x38": "0x045dAEa9536ae0c9A119B8a179C0Efb491e5cb1D",
		97: "0x756f7fc71f67808037A2B3801e8d6afAf83b043C",
		"0x61": "0x756f7fc71f67808037A2B3801e8d6afAf83b043C",
	},
	minterPermissionHelper: {
		56: "0xcbeae003281F14598bE320E1eCe1236A6860b235",
		"0x38": "0xcbeae003281F14598bE320E1eCe1236A6860b235",
		97: "0x80582136C2d6c710aD528F2A9d30504665f65306",
		"0x61": "0x80582136C2d6c710aD528F2A9d30504665f65306",
	},

	/**
	 * @deprecated use MasterMelonFarmer contract instead
	 */
	v1MasterMelonFarmer: {
		56: "0x56088617B75822183323Ce56A742d163d19E7598",
		"0x38": "0x56088617B75822183323Ce56A742d163d19E7598",
		97: "0xaB6AcF99Da8f510Db0deB8D0d0B04dF93BeA7Df2",
		"0x61": "0xaB6AcF99Da8f510Db0deB8D0d0B04dF93BeA7Df2",
	},
	/**
	 * @deprecated contract is not verified
	 */
	tippingContract: {
		56: "0xd1f398cFD58047e6aF3a02C565Da7269F9540715",
		"0x38": "0xd1f398cFD58047e6aF3a02C565Da7269F9540715",
	},
	// add generic BEP20 payments for tips:
};