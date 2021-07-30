import BigNumber from "bignumber.js/bignumber";
//import treaEthLPFarmIcon from '../../assets/img/treat-ethereum-farm-icon.png'
//import treatFarmIcon from '../../assets/img/treat-farm-icon.png'

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
  INTEREST_RATE_BASE: new BigNumber("1e18"),
};

export const addressMap = {
  TREAT: "0x306403fEFcA4675f8928B4999d374dBACFeABaA9",
};

// networkId -> contractId
export const contractAddresses = {
  treat: {
    56: "0xac0c7d9b063ed2c0946982ddb378e03886c064e6",
    97: "0x306403fEFcA4675f8928B4999d374dBACFeABaA9",
  },
  weth: {
    56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
  treatNFTMinter: {
    56: "0x36f8f51f65fe200311f709b797baf4e193dd0b0d",
  },
  treatNFTMinterV1: {
    56: "0xde39d0b9a93dcd541c24e80c8361f362aab0f213",
  },
  treatMart: {
    56: "0x9c7827a4B1A93Aa835d5F29506E9666041BF18d0",
  },
  treatMartV1: {
    56: "0xD48E7709FAC65ad74E526D1fB3d9a3eDbCb15FE0",
    97: "0x6a1f5f66B47f750626761477Fc042661294Bbfb5",
  },
  treatMarketplace: {
    56: "0xA38978E839c08046FA80B0fee55736253Ab3B8a3",
    // NEW CONTRACT ^
    // 56: "0x6991a8e77a1a4ea5819da2c5a65a3524259ca66e",
    97: "0xB70EC99ECBF67453F315635000d20bA28aC35132",
  },
  treatMartBundle: {
    56: "0xb0685346A231272BDa0F30Eb46183F016E5f3dcF",
  },
  treatTradeIn: {
    56: "0xE0f5df4915242E4C4C06D2964Eda53C448fec442",
  },
  freeTreats: {
    56: "0xd17EAf17F4120977ff61F5529B2dF5Af66252238",
  },
};

export const modelSetBundles = {
  minaxxbell: 1,
  carlaasister: 2,
  davinaastewart: 3,
  _thepr0duct: 4,
  polyannie01: 5,
  MissJennyff: 6,
  therealsatania: 7,
  CryptoEmpress: 8,
};
