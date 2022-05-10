import Model from "../../../db/models/Model";
import dbConnect from "../../../utils/dbConnect";

export default async function FTS(req, res) {
  await dbConnect();

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
            path: ["username"],
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
