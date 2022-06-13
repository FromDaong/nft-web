import MoralisInstance, { ethers, web3Node } from "../../../../utils/moralis";

import NFT from "../../../../db/models/NFT";
import TreatNFTMinterAbi from "../../../../treat/lib/abi/treatnftminter.json";
import dbConnect from "../../../../utils/dbConnect";
import navigateToPage from "@utils/pagination";
import { withJWTAuth } from "../../../../utils/server-utils";

dbConnect();

const myNFTs = async (req, res) => {
  const { session } = req;
  let { page } = req.query;
  page = parseInt(page);

  let cursor;
  let owned_nfts: any = {};
  let n = 0;

  while (cursor !== null && n < parseInt(page)) {
    const nfts: any = await MoralisInstance.Web3API.account.getNFTsForContract({
      address: session.ethAddress,
      token_address: process.env.TREAT_MINTER_ADDRESS,
      chain: "bsc",
      limit: 12,
      cursor,
    });
    owned_nfts = nfts;
    n++;

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

  const nftids = owned_nfts.result.map((nft) => Number(nft.token_id));
  // @ts-ignore
  let ownedTokensWithMetadata = await NFT.find({
    id: { $in: nftids },
  });

  ownedTokensWithMetadata = await Promise.all(
    ownedTokensWithMetadata.map(async (data) => {
      const nft_data = owned_nfts.result.find(
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

  ownedTokensWithMetadata = ownedTokensWithMetadata.filter((e) => e);

  page = n;

  return res.json({
    docs: ownedTokensWithMetadata,
    page,
    totalPages: Math.ceil(owned_nfts.total / 12),
    nextPage: page + 1,
    hasNextPage: page < Math.ceil(owned_nfts.total / 12),
    hasPrevPage: page - 1 > 0,
    limit: 12,
    totalDocs: owned_nfts.total,
    prevPage: page === 1 ? null : page - 1,
  });
};

export default withJWTAuth(myNFTs);
