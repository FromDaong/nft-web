import { NextApiRequest, NextApiResponse } from "next";

export default function backend_fn(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  return res.status(200).json({
    error: false,
    message: {
      ...body,
    },
  });
}
