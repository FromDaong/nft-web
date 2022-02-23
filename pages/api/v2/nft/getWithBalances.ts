import Web3 from "web3";
import NFT from "../../../../models/NFT";

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
        const { nfts, reveal } = req.body;

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

            if (nft.blurhash && !reveal) {
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
