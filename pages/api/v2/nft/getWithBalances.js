import Web3 from "web3";
import BigNumber from "bignumber.js";
import NFT from "../../../../models/NFT";
import TreatNFTMinterAbi from "../../../../treat/lib/abi/treatnftminter.json";
import TreatMarketplaceAbi from "../../../../treat/lib/abi/treatMarketplace.json";
import { contractAddresses } from "../../../../treat/lib/constants";
import { getOpenOrdersForSeller } from "../../../../treat/utils";

const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/0e4b710bbd818e9709fe0ef5/bsc/mainnet
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
    query: { id },
    method,
  } = req;

  switch (method) {
    case "POST":
      try {
        if (!req.body.nfts)
          return res.status(200).json({
            docs: [],
          });
        const { nfts, signature, page, account } = req.body;
        const options = {
          page: page ?? 1,
          limit: 12,
          collation: {
            locale: "en",
          },
          sort: {},
        };

        let signer;
        let openOrders;
        if (signature) {
          signer = web3.eth.accounts.recover("Reveal Contents", signature);
          openOrders = await getOpenOrdersForSeller(treatMarketplace, signer);
        }

        const nftids = nfts.map((nft) => {
          if (nft.nftId) return nft.nftId;
          return nft.id;
        });

        const NFTS = await NFT.paginate({ id: { $in: nftids } }, options);

        if (NFTS.docs.length === 0)
          return res
            .status(400)
            .json({ success: false, error: "nft not found" });

        console.log("[+] Getting balances for " + NFTS.docs.length + " NFTS");
        NFTS.docs = await Promise.all(
          NFTS.docs.map(async (nft) => {
            let hasOpenOrder;
            let numberBalance;

            if (signer) {
              const balance = await treatNFTMinter.methods
                .balanceOf(signer, nft.id)
                .call();
              const bigNumberBalance = new BigNumber(balance);
              numberBalance = bigNumberBalance.toNumber();
            } else {
              numberBalance =
                nfts.find((n) => {
                  if (nft.id) return n.id === nft.id;
                  return (n.nftId = nft.id);
                })?.balance ?? 0;
            }

            const balanceV1 =
              nfts.find((n) => {
                if (nft.id) return n.id === nft.id;
                return (n.nftId = nft.id);
              })?.balanceV1 ?? 0;

            if (openOrders) {
              hasOpenOrder = openOrders.find((o) => o === id);
            }

            // Has no balance return undefined
            if (
              numberBalance === 0 &&
              balanceV1 === 0 &&
              !hasOpenOrder &&
              !account
            ) {
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
      res.status(400).json({ success: false, message: "Method requires POST" });
      break;
  }
}
