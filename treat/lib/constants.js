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
  creatorMart: {
    56: "0x9F52D25473CE2DEc1b9D5F44Ad133Ab80BBa1f86",
  },
  creatorMinterHelper: {
    56: "0x66685ccCfD3c1C65220973CDb5E33f706e1F0537",
  },
  treatMart: {
    56: "0x741864585bf7e9C533d52fe02427cE4bf75678D4",
  },
  treatMarketplace: {
    56: "0xA38978E839c08046FA80B0fee55736253Ab3B8a3",
    // NEW CONTRACT ^
    // 56: "0x6991a8e77a1a4ea5819da2c5a65a3524259ca66e",
    97: "0xB70EC99ECBF67453F315635000d20bA28aC35132",
  },
  treatTradeIn: {
    56: "0xE0f5df4915242E4C4C06D2964Eda53C448fec442",
  },
  treatMarketReader: {
    56: "0xFa6C813B1f2e75019dDB81aB518108571c737B22",
  },
  treatSupscriptions: {
    56: "0x6D66571fF0c347B84aA5a3104af6BE4889Bd9877",
  },
  subscriberMart: {
    56: "0x16d68Fe18D8b7dFF8A8626c90AE5d2d949A7C7d5",
  }
};

// Trigger deploy
export const modelSetBundles = {
  iya_themodel: 1,
  little_sophiaaa: 2,
};
