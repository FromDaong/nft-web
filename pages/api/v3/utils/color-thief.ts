import axios from "axios";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import getImagePalette from "image-palette-core";

const colorThief = async (req: NextApiRequest, res: NextApiResponse) => {
  const { imageUrl } = req.body;
  console.log({ imageUrl });

  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  const image_buffer = await Buffer.from(response.data, "binary").toString(
    "base64"
  );

  const palette = getImagePalette(`data:image/png;base64,${image_buffer}`);
  res.status(200).json({
    palette,
  });
};

export default colorThief;
