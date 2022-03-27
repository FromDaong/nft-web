import MoralisInstance, { ethers, web3Node } from "../../../../utils/moralis";
import NFT from "../../../../models/NFT";
import dbConnect from "../../../../utils/dbConnect";
import { withJWTAuth } from "../../../../utils/server-utils";
import { contractAddresses } from "../../../../treat/lib/constants";
import TreatNFTMinterAbi from "../../../../treat/lib/abi/treatnftminter.json";

dbConnect();

const myNFTs = async (req, res) => {
  const { session } = req;

  const options = {
    page: req.query.page ?? 1,
    limit: 12,
    collation: {
      locale: "en",
    },
    sort: {},
  };

  const owned_nfts = await MoralisInstance.Web3API.account.getNFTsForContract({
    address: session.ethAddress,
    token_address: process.env.TREAT_MINTER_ADDRESS,
    chain: "bsc",
  });

  const treatNFTMinter = new ethers.Contract(
    contractAddresses.treatNFTMinter[56],
    TreatNFTMinterAbi,
    web3Node
  );

  contractAddresses.treatNFTMinter[56],

  const nftids = owned_nfts.result.map((nft) => Number(nft.token_id));
  // @ts-ignore
  const ownedTokensWithMetadata = await NFT.paginate(
    {
      id: { $in: nftids },
    },
    options
  );

  ownedTokensWithMetadata.docs = await Promise.all(
    ownedTokensWithMetadata.docs.map((data) => {
      const nft_data = owned_nfts.result.find(
        (owned_nft) => Number(owned_nft.token_id) === data.id
      );
      if (nft_data) {
        const returnObj = {
          ...nft_data,
          ...data.toObject(),
        };

        returnObj.balance = await treatNFTMinter.methods
          .balanceOf(session.address, returnObj.nftId)
          .call();

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
