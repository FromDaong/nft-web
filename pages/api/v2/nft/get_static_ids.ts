import NFT from "@models/NFT";

export const get_static_ids = async (req, res) => {
  try {
    const { start, limit } = req.query;
    const start_int = parseInt(start);
    const limit_int = parseInt(limit);

    const nfts = await NFT.find({}).skip(start_int).limit(limit_int);
    const ids = nfts.map((nft) => nft.id);

    return res.json({ ids });
  } catch (err) {
    return res.status(500).send("Error getting static ids");
  }
};
