import MoralisInstance from "../../../../utils/moralis";

export default async function all_nfts(req, res) {
  const owned_nfts = await MoralisInstance.Web3API.account.getNFTsForContract({
    address: process.env.TREAT_MINTER_ADDRESS,
    token_address: process.env.TREAT_MINTER_ADDRESS,
    chain: "bsc",
  });
  const nftids = owned_nfts.result.map((nft) => Number(nft.token_id))
}
