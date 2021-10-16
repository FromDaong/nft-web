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
    97: "0x8fF95CE7984410fda65A08646E16FC7BaC6bea7b",
  },
  treat2: {
    56: "0x01bd7acb6fF3B6Dd5aefA05CF085F2104f3fC53F",
    97: "0x5Bfa598212A6c15Dea22De0af2bd1B5124efAa9d",
  },
  weth: {
    56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    97: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
  },
  treatNFTMinter: {
    56: "0x36f8f51f65fe200311f709b797baf4e193dd0b0d",
    97: "0xe7F8059Ac6f4A230C0c08aDfa9e09A2156236239",
  },
  treatNFTMinterV1: {
    56: "0xde39d0b9a93dcd541c24e80c8361f362aab0f213",
    97: "0xde83588bdB26c91B642C779a7C41722ca2364563",
  },
  creatorMart: {
    56: "0xE965D19FD021355fc85f4Cdcc856C018274cACF8",
    97: "0x76936371d434Ec96803C4c2983b9AF6ad2f2678c",
  },
  creatorMinterHelper: {
    56: "0x66685ccCfD3c1C65220973CDb5E33f706e1F0537",
    97: "0x0119b60DB932306Bea68414fbFb0ef4d9769AA2b",
  },
  treatMart: {
    56: "0x741864585bf7e9C533d52fe02427cE4bf75678D4",
    97: "0x250a0463D2A1C774Bbad4D667afda7ac6A38ab5C",
  },
  treatMarketplace: {
    56: "0xA38978E839c08046FA80B0fee55736253Ab3B8a3",
    // NEW CONTRACT ^
    // 56: "0x6991a8e77a1a4ea5819da2c5a65a3524259ca66e",
    97: "0xB70EC99ECBF67453F315635000d20bA28aC35132",
  },
  treatTradeIn: {
    56: "0xE0f5df4915242E4C4C06D2964Eda53C448fec442",
    97: "0x34289187D887486cD1C98d6253621ae6ADC7cb3e",
  },
  treatMarketReader: {
    56: "0xFa6C813B1f2e75019dDB81aB518108571c737B22",
    97: "0x28F1526838868aA83c9a90B054873d15BB88FB6F",
  },
  treatSubscriptions: {
    56: "0x0d5FA8001E1193E03A66f9C969F2419450b0909d",
    97: "0xe8b1eaa85c05FDF13FeCc6358302b035B000f6B3",
  },
  subscriberMart: {
    56: "0x16d68Fe18D8b7dFF8A8626c90AE5d2d949A7C7d5",
    97: "0x33Cc2629bcc81f87FBF75a5428B5696f53cEb452",
  },
  totwMinterHelper: {
    56: "0x3Da2011868dc84Af49Fbc6e5f97D8b2ea9998D76",
    97: "0x756f7fc71f67808037A2B3801e8d6afAf83b043C",
  },
  treatV1ForV2: {
    56: "0xcF9fF354f29334E6Beeb2245051846801aE73f8F",
    97: "0xD99F67F5604D19371df6e599085719a365711d56"
  }
};

// Trigger deploy
export const modelSetBundles = {
  davinaastewart: 5,
};
