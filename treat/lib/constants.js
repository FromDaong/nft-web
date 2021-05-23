import BigNumber from 'bignumber.js/bignumber'
//import treaEthLPFarmIcon from '../../assets/img/treat-ethereum-farm-icon.png'
//import treatFarmIcon from '../../assets/img/treat-farm-icon.png'

export const SUBTRACT_GAS_LIMIT = 100000

const ONE_MINUTE_IN_SECONDS = new BigNumber(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.times(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.times(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.times(365)

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  ONES_31: new BigNumber('4294967295'), // 2**32-1
  ONES_127: new BigNumber('340282366920938463463374607431768211455'), // 2**128-1
  ONES_255: new BigNumber(
    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  ), // 2**256-1
  INTEREST_RATE_BASE: new BigNumber('1e18'),
}

export const addressMap = {
  TREAT: '0xac0c7d9b063ed2c0946982ddb378e03886c064e6',
}

// networkId -> contractId
export const contractAddresses = {
  treat: {
    56: '0xac0c7d9b063ed2c0946982ddb378e03886c064e6',
    97: '0x306403fEFcA4675f8928B4999d374dBACFeABaA9',
  },
  weth: {
    56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  },
  treatNFTMinter: {
    // 56: '0xde39d0b9a93dcd541c24e80c8361f362aab0f213',
    // ^ original Minter, `isApprovedForAll` is broken

    56: '0x4Ab5d39EEe7294c1b644639389BF751ef6442902',
    97: '0x14EC429a83684959BADfBF1C27169632285635C3',
    // ^ test minter from granola
    // 56: '0x89689bb544820b6ad6b7d239e6afeaf856879d2a',
    // ^ test minter for testing the marketplace contract
  },
  treatMart: {
    56: '0xD48E7709FAC65ad74E526D1fB3d9a3eDbCb15FE0',
    97: '0x6a1f5f66B47f750626761477Fc042661294Bbfb5',
  },
  treatMarketplace: {
    56: '0x6991a8e77a1a4ea5819da2c5a65a3524259ca66e',
    97: '0xB70EC99ECBF67453F315635000d20bA28aC35132',
  }
}


export const modelSetBundles = {
  minaxxbell: 1
};