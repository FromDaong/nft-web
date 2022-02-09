import dbConnect from "../../../utils/dbConnect";
import Model from "../../../models/Model";

dbConnect();

export default async function FTS(req, res) {
  const s = req.query.s;
  const options = {
    page: req.query.p ?? 1,
    limit: 24,
    collation: {
      locale: "en",
    },
  };

  try {
    const aggregate = Model.aggregate([
      {
        $search: {
          text: {
            query: `${s}*`,
            path: ["username", "bio", "display_name"],
          },
        },
      },
    ]);

    let data = await Model.aggregatePaginate(aggregate, options);
    return res.json({ data });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
}
