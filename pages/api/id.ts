import { NextApiResponse } from "next";
import { readFile } from "fs/promises";

export default async function is(req, res: NextApiResponse) {
  const file = await readFile("/Users/munychitz/misx/480P_2000K_404785251.mp4");

  return res.send(file);
}
