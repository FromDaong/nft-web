import { NextApiRequest, NextApiResponse } from "next";
// enable this webhook to set live

const livestream_hook = (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  console.log({ body });

  res.status(200).json({ error: false });
};

export default livestream_hook;
