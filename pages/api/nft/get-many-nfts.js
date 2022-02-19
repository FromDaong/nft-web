import dbConnect from "../../../utils/dbConnect";
import { mapNftBody } from "./mappers";
import NFT from "../../../models/NFT";
import Model from "../../../models/Model";
import Web3 from "web3";
import { getBalanceNumber } from "../../../utils/formatBalance";
import TreatNFTMinterAbi from "../../../treat/lib/abi/treatnftminter.json";
import TreatMarketplaceAbi from "../../../treat/lib/abi/treatMarketplace.json";
import { getNftMaxSupply, getNftTotalSupply } from "../../../treat/utils";
import { contractAddresses } from "../../../treat/lib/constants";

dbConnect();

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
);

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  contractAddresses.treatNFTMinter[56]
);

export default async (req, res) => {
  const {
    query: { id, p },
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
        const { sort } = req.query;
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

        if (req.query.s) {
          const aggregate = NFT.aggregate([
            {
              $search: {
                index: "init",
                text: {
                  query: `${req.query.s}*`,
                  path: ["name", "description", "model_handle"],
                },
              },
            },
            {
              $match: {
                id: { $in: req.body.nfts },
              },
            },
          ]);
          NFTres = await NFT.aggregatePaginate(aggregate, options);
        } else {
          NFTres = await NFT.paginate({ id: { $in: req.body.nfts } }, options);
        }

        if (NFTres.docs.length === 0)
          return res
            .status(400)
            .json({ success: false, error: "nft not found" });

        NFTres.docs = await Promise.all(
          NFTres.docs.map(async (nft) => {
            const maxSupply = (
              await getNftMaxSupply(treatNFTMinter, id)
            )?.toNumber();
            const totalSupply = (
              await getNftTotalSupply(treatNFTMinter, id)
            )?.toNumber();

            const returnObj = { ...nft._doc, maxSupply, totalSupply };
            if (nft.blurhash) delete returnObj.image;

            return returnObj;
          })
        );

        console.log(NFTres);

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
