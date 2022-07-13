import Moralis from "moralis/node";
import Web3 from "web3";
const ethers = Moralis.web3Library;

const url =
  "https://nd-421-513-967.p2pify.com/4b6934a4a6a6ace1d6ba8644eae82d6e";
const web3Node = new ethers.providers.JsonRpcProvider(url);
const web3 = new Web3(url);

const MoralisInstance = Moralis;
MoralisInstance.start({
  appId: "WZSAZ8e1qSzKZ0U7xRErmhoiYraqhoIyU0CCQ2bJ",
  serverUrl: "https://ee15wkl2kmkl.usemoralis.com:2053/server",
});

global.MoralisInstance = MoralisInstance;

export default MoralisInstance;
export { web3Node, ethers, web3 };
