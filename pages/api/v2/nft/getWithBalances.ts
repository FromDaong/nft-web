import Web3 from "web3";
import NFT from "../../../../models/NFT";
import { getNftBalance } from "../../../../treat/utils";
import { getNftV1Balance } from "../../../../treat/utils";
import TreatNFTMinterAbi from "../../../../treat/lib/abi/treatnftminter.json";
import TreatNFTMinterV1Abi from "../../../../treat/lib/abi/treatnftminterv1.json";
import { contractAddresses } from "../../../../treat/lib/constants";
import { getOpenOrdersForSeller } from "../../../../treat/utils";

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
);

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  contractAddresses.treatNFTMinter[56]
);

const treatNFTV1Minter = new web3.eth.Contract(
  TreatNFTMinterV1Abi,
  contractAddresses.treatNFTMinter[56]
);

export default async function getWithBalances(req, res) {
  const {
    query: { id, p },
    method,
  } = req;

  switch (method) {
    case "POST":
      try {
        if (!req.body.account || !req.body.nfts)
          return res.status(401).send("Unauthorized");
        const { account, nfts } = req.body;

        const nftids = nfts.map((nft) => nft.id);

        const options = {
          page: req.query.p ?? 1,
          limit: 24,
          collation: {
            locale: "en",
          },
          sort: {},
        };

        const NFTS = await NFT.paginate({ id: { $in: nftids } }, options);

        if (NFTS.docs.length === 0)
          return res
            .status(400)
            .json({ success: false, error: "nft not found" });

        console.log("[+] Getting balances for " + NFTS.docs.length + " NFTS");
        NFTS.docs = await Promise.all(
          NFTS.docs.map(async (nft) => {
            const balance = nfts.find((n) => n.id === nft.id)?.balance ?? 0;
            const balanceV1 = nfts.find((n) => n.id === nft.id)?.balanceV1 ?? 0;
            // Has no balance return undefined
            if (balance === 0 && balanceV1 === 0) return null;

            const returnObj = { ...nft._doc, balance, balanceV1 };

            if (nft.blurhash) {
              delete returnObj.image;
              delete returnObj.daoCdnUrl;
            }

            return returnObj;
          })
        );

        // Filter out nulls
        NFTS.docs = NFTS.docs.filter((e) => e);

        res.status(200).json(NFTS);
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
