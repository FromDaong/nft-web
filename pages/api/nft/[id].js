import dbConnect from "utils/dbConnect";
// import Product from "models/Product";
// import User from "models/User";
import withSession from "lib/session";

dbConnect();

export default withSession(async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const nftData = {
          pool: {
            name: "root",
            points: 1,
          },
          external_url: "https://smol.finance",
          image: "https://api.smol.finance/studio/images/gifs/1",
          name: "Woodsy",
          description:
            "Smoking this smol won’t get you high, but you might as well try.",
          attributes: [
            {
              trait_type: "Set",
              value: "Genesis",
            },
            {
              trait_type: "Rarity",
              value: "Rare",
            },
            {
              trait_type: "Artist",
              value: "@adventuringthrough, @ppmcghee",
            },
            {
              trait_type: "Type",
              value: "Smol",
            },
            {
              trait_type: "Max Supply",
              value: "150",
            },
          ],
        };
        res.status(200).json(nftData);
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
});
