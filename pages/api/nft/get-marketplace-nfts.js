import dbConnect from "../../../utils/dbConnect";
import NFT from "../../../models/NFT";
// import User from "../../../../models/User";
import withSession from "../../../lib/session";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const options = {
          page: req.query.p ?? 1,
          limit: 24,
          collation: {
            locale: "en",
          },
        };

        const NFTs = await NFT.paginate(
          {
            old_totw: { $exists: false },
            old_totm: { $exists: false },
            melon_nft: { $exists: false },
            subscription_nft: { $exists: false },
          },
          options
        );

        NFTs.docs = await NFTs.docs.map((n) => {
          const returnObj = { ...n.toObject() };

          returnObj.mints = returnObj.mints.length;
          delete returnObj.identity_access_key;

          if (returnObj.blurhash) {
            delete returnObj.image;
            delete returnObj.daoCdnUrl;
          }
          return returnObj;
        });

        res.status(200).json(NFTs);
      } catch (error) {
        console.error({ error });
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
