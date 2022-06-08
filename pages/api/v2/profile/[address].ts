import MoralisInstance from "../../../../utils/moralis";
import NFT from "../../../../db/models/NFT";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import Profile from "../../../../db/models/Profile";
import dbConnect from "../../../../utils/dbConnect";
import navigateToPage from "@utils/pagination";

dbConnect();

export default async function profile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const address = req.query.address as any;
    const page = req.query.page as any;
    const options = {
      limit: 12,
      collation: {
        locale: "en",
      },
      sort: {},
    };

    const profile = await Profile.findOne({ address });
    const ownedNFTs = await MoralisInstance.Web3API.account
      .getNFTsForContract({
        address,
        token_address: process.env.TREAT_MINTER_ADDRESS,
        chain: "bsc",
        limit: 12,
      })
      .then((response) => navigateToPage(response, parseInt(page ?? 1)));
    const ownedNFTsIds = await ownedNFTs.result.map((nft) => nft.token_id);

    // @ts-ignore
    const nftsWithMetadata = await NFT.paginate(
      {
        id: { $in: ownedNFTsIds },
      },
      options
    );

    nftsWithMetadata.docs = await Promise.all(
      nftsWithMetadata.docs.map((data) => {
        const nft_data = ownedNFTs.result.find(
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

          if (returnObj.blurhash) {
            delete returnObj.image;
          }

          // Removing this to minimize total payload, get only what we need.
          delete returnObj.description;
          delete returnObj.mints;

          return returnObj;
        }
        return undefined;
      })
    );

    return res.status(200).json({
      profile: { ...profile },
      owned_nfts: nftsWithMetadata,
      address,
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ err });
  }
}
