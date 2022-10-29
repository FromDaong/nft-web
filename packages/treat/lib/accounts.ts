export class Account {
  contracts: any;
  accountInfo: any;
  type: string;
  allocation: any[];
  balances: object;
  status: string;
  approvals: object;
  walletInfo: object;
  constructor(contracts, address) {
    this.contracts = contracts;
    this.accountInfo = address;
    this.type = "";
    this.allocation = [];
    this.balances = {};
    this.status = "";
    this.approvals = {};
    this.walletInfo = {};
  }
}
