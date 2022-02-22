import axios from "axios";

// Checks if image does not return error from CDN
// If it does it then downloads and sends the base64 encoded image from pinata
export default async function fetchWithFallback(req, res) {
  try {
    await axios.get(req.query.cdn);
    res.send(`${req.query.cdn}-/quality/lighter/-/format/webp/`);
  } catch (err) {
    // const resp = await axios.get(req.query.default);
    // const blob = data.replace(`"`, "").replace(/["']/g, "");

    return res.send(req.query.default);
  }
}
