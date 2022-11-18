import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default function TreatAPI(req: NextApiRequest, res: NextApiResponse) {
  return res.json({
    request: req.body,
  });
}
