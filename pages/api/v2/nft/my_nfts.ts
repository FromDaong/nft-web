import MoralisInstance, { ethers, web3Node } from "../../../../utils/moralis";

import NFT from "../../../../db/models/NFT";
import TreatNFTMinterAbi from "../../../../treat/lib/abi/treatnftminter.json";
import dbConnect from "../../../../utils/dbConnect";
import navigateToPage from "@utils/pagination";
import { withJWTAuth } from "../../../../utils/server-utils";

dbConnect();

const myNFTs = async (req, res) => {
  const { session } = req;
  const { page } = req.query;

  const options = {
    collation: {
      locale: "en",
    },
    sort: {},
    page,
    limit: 12,
  };

  let cursor;
  let owned_nfts = [];

  while (cursor !== null) {
    const nfts = await MoralisInstance.Web3API.account.getNFTsForContract({
      address: session.ethAddress,
      token_address: process.env.TREAT_MINTER_ADDRESS,
      chain: "bsc",
      limit: 100,
      cursor,
    });
    owned_nfts = [...owned_nfts, ...nfts.result];
    if (nfts.next) {
      cursor = nfts.cursor;
    } else {
      cursor = null;
    }
  }

  // .then((response) => navigateToPage(response, parseInt(page ?? 1)));

  const treatNFTMinter = new ethers.Contract(
    process.env.TREAT_MINTER_ADDRESS,
    TreatNFTMinterAbi,
    web3Node
  );

  const nftids = owned_nfts.map((nft) => Number(nft.token_id));
  // @ts-ignore
  const ownedTokensWithMetadata = await NFT.paginate(
    {
      id: { $in: nftids },
    },
    options
  );

  ownedTokensWithMetadata.docs = await Promise.all(
    ownedTokensWithMetadata.docs.map(async (data) => {
      const nft_data = owned_nfts.find(
        (owned_nft) => Number(owned_nft.token_id) === data.id
      );
      if (nft_data) {
        const returnObj = {
          ...nft_data,
          ...data.toObject(),
        };

        const balance = await treatNFTMinter.balanceOf(
          session.ethAddress,
          returnObj.id
        );

        returnObj.balance = Number(balance.toString());

        if (returnObj.cdnUrl) {
          returnObj.image = returnObj.cdnUrl;
          delete returnObj.cdnUrl;
        }

        // Removing this to minimize total payload, get only what we need.
        delete returnObj.description;
        delete returnObj.mints;

        return returnObj;
      }
      return undefined;
    })
  );

  ownedTokensWithMetadata.docs = ownedTokensWithMetadata.docs.filter((e) => e);
  return res.json(ownedTokensWithMetadata);
};

export default withJWTAuth(myNFTs);
