import axios from "axios";

// Checks if image does not return error from CDN
// If it does it then downloads and sends the base64 encoded image from pinata
export default async function fetchWithFallback(req, res) {
  if (!req.query.cdn) {
    try {
      if (req.query.default.includes("mypinata")) {
        return res.send(req.query.default);
      } else {
        const cdnurl = `${req.query.default}-/quality/lighter/-/format/webp/`;
        await axios.get(cdnurl);
        return res.send(cdnurl);
      }
    } catch (err) {
      return res.send(req.query.default);
    }
  }
  try {
    const cdnurl = `${req.query.cdn}-/quality/lighter/-/format/webp/`;
    await axios.get(cdnurl);

    return res.send(cdnurl);
  } catch (err) {
    // const resp = await axios.get(req.query.default);
    // const blob = data.replace(`"`, "").replace(/["']/g, "");
    return res.send(req.query.default);
  }
}
