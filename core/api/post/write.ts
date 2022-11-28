import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { Like } from "./types";

export const like_post = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.data)
    return res.status(500).json({
      error: true,
      message: "Could not complete that action. Please try again.",
    });

  const data: Like = req.body.data;
  // Persist like to database

  return res.status(200).json({ error: false, message: "Ok" });
};

export const unlike_post = (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.data)
    return res.status(500).json({
      error: true,
      message: "Could not complete that action. Please try again.",
    });

  const data: Like = req.body.data;
  // Persist like to database

  return res.status(200).json({ error: false, message: "Ok" });
};

export const create_post = (req: NextApiRequest, res: NextApiResponse) => {};

export const create_trit_nft_collection = (
  req: NextApiRequest,
  res: NextApiResponse
) => {};

export const buy_trit_nft = (req: NextApiRequest, res: NextApiResponse) => {};

export const buy_trit_nft_collection = (
  req: NextApiRequest,
  res: NextApiResponse
) => {};

export const list_trit_nft_for_resale = (
  req: NextApiRequest,
  res: NextApiResponse
) => {};

export const archive_post = (req: NextApiRequest, res: NextApiResponse) => {};

export const tip_post = (req: NextApiRequest, res: NextApiResponse) => {};

export const save_to_collection = (
  req: NextApiRequest,
  res: NextApiResponse
) => {};

export const send_offer_for_creator = (
  req: NextApiRequest,
  res: NextApiResponse
) => {};

export const get_post_shorturl = (
  req: NextApiRequest,
  res: NextApiResponse
) => {};
