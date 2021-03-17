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
          name: "treat dao",
          description: "desc of treat dao",
          image: "https://api.smol.finance/studio/images/SmolLogo",
          external_link: "https://smol.finance",
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
