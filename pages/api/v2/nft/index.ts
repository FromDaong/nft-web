import * as atob from "atob";

import MoralisInstance from "../../../../utils/moralis";
import NFT from "../../../../models/NFT";
import dbConnect from "../../../../utils/dbConnect";

dbConnect();
const { TREAT_MINT_OWNER_ADDRESS, TREAT_MINTER_ADDRESS } = process.env;

const sanitize_nft_data = (nft_data) => {
  const returnObj = { ...(nft_data.toObject ? nft_data.toObject() : nft_data) };

  returnObj.mints = returnObj.mints.length;
  delete returnObj.identity_access_key;

  if (returnObj.blurhash) {
    delete returnObj.image;
    delete returnObj.daoCdnUrl;
  }

  if (returnObj.daoCdnUrl) {
    returnObj.image = returnObj.daoCdnUrl;
  }
  return returnObj;
};

export default async function all_nfts(req, res) {
  const { s, p, tags, sort, all } = req.query;
  let filterTags = [];
  let NFTs;

  console.log({ TREAT_MINT_OWNER_ADDRESS, TREAT_MINTER_ADDRESS });

  if (tags) {
    filterTags = atob(tags).split(",");
  }

  const options = {
    page: p ?? 1,
    limit: 24,
    collation: {
      locale: "en",
    },
    sort: {
      id: 0,
      list_price: 0,
    },
  };

  if (sort) {
    switch (sort) {
      case "recent":
        options.sort.id = -1;
        break;
      case "desc":
        options.sort.list_price = -1;
        break;
      case "asc":
        options.sort.list_price = 1;
        break;
      default:
        options.sort.id = -1;
        break;
    }
  } else {
    options.sort.id = -1;
  }

  const all_nfts = await MoralisInstance.Web3API.account.getNFTsForContract({
    address: "0xE965D19FD021355fc85f4Cdcc856C018274cACF8",
    token_address: TREAT_MINTER_ADDRESS,
    chain: "bsc",
  });
  console.log({ owned_nfts: all_nfts });
  const nftids = all_nfts.result.map((nft) => Number(nft.token_id));

  try {
    if (all) {
      let NFTs = await NFT.find({
        id: { $in: nftids },
      });
      NFTs = await NFTs.map((n) => sanitize_nft_data(n));
      return res.status(200).json(NFTs);
    }

    if (s) {
      const agg = [
        {
          $search: {
            index: "init",
            wildcard: {
              query: `${s}*`,
              path: ["name", "description", "model_handle"],
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            old_totw: { $exists: false },
            old_totm: { $exists: false },
            melon_nft: { $exists: false },
            subscription_nft: { $exists: false },
            ...(filterTags.length > 0 && { tags: { $in: filterTags } }),
            id: { $in: nftids },
          },
        },
      ];
      const aggregate = NFT.aggregate(agg);
      // @ts-ignore
      NFTs = await NFT.aggregatePaginate(aggregate, options);
    } else {
      const query = {
        old_totw: { $exists: false },
        old_totm: { $exists: false },
        melon_nft: { $exists: false },
        subscription_nft: { $exists: false },
        id: { $in: nftids },
        tags: null,
      };

      if (filterTags.length > 0) {
        query.tags = {
          $in: filterTags,
        };
      } else {
        delete query.tags;
      }
      // @ts-ignore
      NFTs = await NFT.paginate(query, options);
    }

    NFTs.docs = await NFTs.docs.map((n) => sanitize_nft_data(n));
    return res.status(200).json(NFTs);
  } catch (error) {
    console.error({ error });
    res
      .status(400)
      .json({ success: false, error: error, db: process.env.MONGO_URL });
  }
}
