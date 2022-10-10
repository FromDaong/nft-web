export const ConfirmationType = {
  Hash: 0,
  Confirmed: 1,
  Both: 2,
  Simulate: 3,
};

export interface IContracts {
  web3: any;
  defaultConfirmations: any;
  autoGasMultiplier: any;
  confirmationType: any;
  defaultGas: any;
  defaultGasPrice: any;
  treat: any;
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
}
