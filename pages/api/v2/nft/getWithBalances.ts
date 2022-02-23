import Web3 from "web3";
import BigNumber from "bignumber.js";
import NFT from "../../../../models/NFT";
import TreatNFTMinterAbi from "../../../../treat/lib/abi/treatnftminter.json";
import TreatMarketplaceAbi from "../../../../treat/lib/abi/treatMarketplace.json";
import { contractAddresses } from "../../../../treat/lib/constants";
import { getOpenOrdersForSeller } from "../../../../treat/utils";

const web3 = new Web3(
  "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/"
);

const treatNFTMinter = new web3.eth.Contract(
  TreatNFTMinterAbi,
  contractAddresses.treatNFTMinter[56]
);

const treatMarketplace = new web3.eth.Contract(
  TreatMarketplaceAbi,
  contractAddresses.treatMarketplace[56]
);

export default async function getWithBalances(req, res) {
  const {
    query: { id, p },
    method,
  } = req;

  switch (method) {
    case "POST":
      try {
        if (!req.body.nfts)
          return res.status(200).json({
            docs: [],
          });
        const { nfts, signature } = req.body;
        const options = {
          page: req.query.p ?? 1,
          limit: 24,
          collation: {
            locale: "en",
          },
          sort: {},
        };

        let signer;
        if (signature) {
          signer = web3.eth.accounts.recover("Reveal Contents", signature);
        }

        const nftids = nfts.map((nft) => nft.id);
        const openOrders = await getOpenOrdersForSeller(
          treatMarketplace,
          signer
        );

        const NFTS = await NFT.paginate({ id: { $in: nftids } }, options);

        if (NFTS.docs.length === 0)
          return res
            .status(400)
            .json({ success: false, error: "nft not found" });

        console.log("[+] Getting balances for " + NFTS.docs.length + " NFTS");
        NFTS.docs = await Promise.all(
          NFTS.docs.map(async (nft) => {
            const balance = await treatNFTMinter.methods
              .balanceOf(signer, nft.id)
              .call();

            const bigNumberBalance = new BigNumber(balance);
            const numberBalance = bigNumberBalance.toNumber();
            const balanceV1 = nfts.find((n) => n.id === nft.id)?.balanceV1 ?? 0;

            const hasOpenOrder =
              !!openOrders && !!openOrders.find((o) => o === id);

            // Has no balance return undefined
            if (numberBalance === 0 && balanceV1 === 0 && !hasOpenOrder) {
              return null;
            }

            const returnObj = {
              ...nft._doc,
              balance: numberBalance,
              balanceV1,
              hasOpenOrder,
            };

            if (nft.blurhash && !signer) {
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
