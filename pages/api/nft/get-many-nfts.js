import * as atob from "atob";

import { getNftMaxSupply, getNftTotalSupply } from "../../../treat/utils";

import NFT from "../../../db/models/NFT";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import Web3 from "web3";
import { contractAddresses } from "../../../treat/lib/constants";
import dbConnect from "../../../utils/dbConnect";

dbConnect();

const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/0e4b710bbd818e9709fe0ef5/bsc/mainnet"
);

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  contractAddresses.treatNFTMinter[56]
);

export default async (req, res) => {
  const {
    query: { id, s },
    method,
  } = req;

  switch (method) {
    case "POST":
      try {
        if (!req.body.nfts) return res.status(200).json([]);
        const options = {
          page: req.query.p ?? 1,
          limit: 24,
          collation: {
            locale: "en",
          },
          sort: {},
        };
        let NFTres;
        const { sort, tags } = req.query;
        let filterTags = [];
        if (tags) {
          filterTags = atob(tags).split(",");
        }

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
              options.sort.list_price = -1;
              break;
          }
        } else {
          options.sort.id = -1;
        }

        if (s) {
          const aggregate = NFT.aggregate([
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
                id: { $in: req.body.nfts },
                ...(filterTags.length > 0 && { tags: { $in: filterTags } }),
              },
            },
          ]);
          NFTres = await NFT.aggregatePaginate(aggregate, options);
          console.log(NFTres);
        } else {
          const query = { id: { $in: req.body.nfts } };
          if (filterTags.length > 0) {
            query.tags = { $in: filterTags };
          }
          NFTres = await NFT.paginate(query, options);
        }

        if (NFTres.docs.length === 0)
          return res
            .status(200)
            .json({ success: false, error: "nft not found" });
        console.log(NFTres.docs);
        NFTres.docs = await Promise.all(
          NFTres.docs.map(async (nft) => {
            const maxSupply = (
              await getNftMaxSupply(treatNFTMinter, id)
            )?.toNumber();
            const totalSupply = (
              await getNftTotalSupply(treatNFTMinter, id)
            )?.toNumber();

            const returnObj = {
              ...(nft.toObject ? nft.toObject() : nft),
              maxSupply,
              totalSupply,
            };
            if (nft.blurhash) {
              delete returnObj.image;
              delete returnObj.daoCdnUrl;
            }

            return returnObj;
          })
        );

        res.status(200).json(NFTres);
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
};
