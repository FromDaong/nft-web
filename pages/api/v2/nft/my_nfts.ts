import MoralisInstance from "../../../../utils/moralis";
import dbConnect from "../../../../utils/dbConnect";
import { withJWTAuth } from "../../../../utils/server-utils";
import NFT from "../../../../models/NFT";
import Web3 from "web3";

dbConnect();

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
);

const myNFTs = async (req, res) => {
  const { session } = req;
  let body = null;
  let signature = null;
  if (req.method === "POST") {
    body = req.body;
    signature = body.signature;

    if (signature) {
      try {
        const signer = web3.eth.accounts.recover("Reveal Contents", signature);
        const address = session.ethAddress.toUpperCase();
        if (signer.toUpperCase() !== address) {
          return res.status(403).json({
            error: "Invalid signature",
          });
        }
      } catch (err) {
        return res.status(403).json({
          error: "Invalid signature",
        });
      }
    }
  }

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
    limit: 1000,
  });

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

        if (returnObj.cdnUrl) {
          returnObj.image = returnObj.cdnUrl;
          delete returnObj.cdnUrl;
        }

        // Removing this to minimize total payload, get only what we need.
        delete returnObj.description;
        delete returnObj.mints;

        if (returnObj.blurhash && !signature) {
          delete returnObj.image;
        }

        return returnObj;
      }
      return undefined;
    })
  );

  ownedTokensWithMetadata.docs = ownedTokensWithMetadata.docs.filter((e) => e);
  return res.json(ownedTokensWithMetadata);
};

export default withJWTAuth(myNFTs);
