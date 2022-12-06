import Web3 from "web3";

const url = process.env.NEXT_PUBLIC_RPC_NODE_URL;
const web3 = new Web3(url);

export default web3;
