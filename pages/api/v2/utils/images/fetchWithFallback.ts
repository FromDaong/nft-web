import axios from "axios";
const sharp = require("sharp");

// Checks if image does not return error from CDN
// If it does it then downloads and sends the base64 encoded image from pinata
export default async function fetchWithFallback(req, res) {
  if (!req.query.cdn) {
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
        await axios.get(cdnurl);
        return res.send(cdnurl);
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
  try {
    const cdnurl = `${req.query.cdn}-/quality/lighter/-/format/webp/`;
    await axios.get(cdnurl);

    return res.send(cdnurl);
  } catch (err) {
    // const resp = await axios.get(req.query.default);
    // const blob = data.replace(`"`, "").replace(/["']/g, "");
    const response = await axios.get(req.query.default, {
      responseType: "arraybuffer",
    });
    const blob = response.data.replace(`"`, "").replace(/["']/g, "");
    const image = await sharp(Buffer.from(blob))
      .resize(500)
      .toFormat("webp", { nearLossless: true, quality: 50 })
      .toBuffer();
    res.setHeader("Content-Type", "image/webp");
    return res.send(image);
  }
}
