import axios from "axios";
const sharp = require("sharp");

// Checks if image does not return error from CDN
// If it does it then downloads and sends the base64 encoded image from pinata
export default async function fetchWithFallback(req, res) {
  try {
    if (req.query.default.includes("mypinata")) {
      const response = await axios.get(req.query.default, {
        responseType: "arraybuffer",
      });
      const image = await sharp(Buffer.from(response.data))
        .resize(500)
        .toFormat("webp", { nearLossless: true, quality: 50 })
        .toBuffer();
      res.setHeader("Content-Type", "image/webp");
      return res.send(image);
    } else {
      const cdnurl = `${req.query.default}-/quality/lighter/-/format/webp/`;
      const image_data = await axios.get(cdnurl);
      const image = image_data.data;
      res.setHeader("Content-Type", "image/webp");
      return res.send(image);
    }
  } catch (err) {
    const response = await axios.get(req.query.default, {
      responseType: "arraybuffer",
    });
    const image = await sharp(Buffer.from(response.data))
      .resize(500)
      .toFormat("webp", { nearLossless: true, quality: 50 })
      .toBuffer();
    res.setHeader("Content-Type", "image/webp");
    return res.send(image);
  }
}
