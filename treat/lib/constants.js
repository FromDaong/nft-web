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
    56: '0xac0c7d9b063ed2c0946982ddb378e03886c064e6'
  },
  weth: {
    56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
  },
  treatNFTMinter: {
    56: '0xde39d0b9a93dcd541c24e80c8361f362aab0f213'
  },
  treatMart: {
    //56: '0x769C54A55FF7d3CeccD060710bb849eDbCc97351'
    // ^ accept treat
    //56: '0x89362Fd6ff407591D4bE8fda0580C115DD6BC5b6'
    // ^ accept wbnb
    //56: '0x5A8e9c992D23A643011f5835A2D1DBE08Af4ff28'
    // ^ accept bnb
    56: '0xD48E7709FAC65ad74E526D1fB3d9a3eDbCb15FE0'
    // ^ accept bnb with setable performer percentage
  },
  treatMartBundle: {
    56: '0xb0685346A231272BDa0F30Eb46183F016E5f3dcF'
  },
  freeTreats: {
    56: '0xd17EAf17F4120977ff61F5529B2dF5Af66252238'
  }
}


export const modelSetBundles = {
  minaxxbell: 1,
  carlaasister: 2,
  davinaastewart: 3,
  _thepr0duct: 4,
};