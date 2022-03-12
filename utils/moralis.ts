import Moralis from "moralis/node";
const ethers = Moralis.web3Library;

const url =
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/";
const web3Node = new ethers.providers.JsonRpcProvider(url);

const MoralisInstance = Moralis;
MoralisInstance.start({
  appId: "WZSAZ8e1qSzKZ0U7xRErmhoiYraqhoIyU0CCQ2bJ",
  serverUrl: "https://ee15wkl2kmkl.usemoralis.com:2053/server",
});

global.MoralisInstance = MoralisInstance;

export default MoralisInstance;
export { web3Node, ethers };
