import axios from "axios";
const atob = require("atob");

function dataURLtoFile(dataurl) {
  const arr = dataurl.split(",");
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return Buffer.from(u8arr);
}

// Checks if image does not return error from CDN
// If it does it then downloads and sends the base64 encoded image from pinata
export default async function fetchWithFallback(req, res) {
  if (req.query.default.includes("mypinata")) {
    try {
      const response = await axios.get(req.query.default, {
        responseType: "arraybuffer",
      });
      return res.send(Buffer.from(response.data));
    } catch (err) {
      console.log({ err });
      const response = await axios.get(req.query.default);

      const blob = dataURLtoFile(response.data); //response.data.replace(`"`, "").replace(/["']/g, "");
      return res.send(blob);
    }
  } else {
    try {
      const cdnurl = `${req.query.default}-/quality/lighter/-/format/webp/`;
      const image_data = await fetch(cdnurl);
      const img = await image_data.arrayBuffer();
      res.setHeader("Content-Type", "image/webp");
      return res.send(Buffer.from(img));
    } catch (err) {
      console.log({ err });
      const response = await axios.get(req.query.default, {
        responseType: "arraybuffer",
      });

      const blob = response.data.replace(`"`, "").replace(/["']/g, "");
      res.setHeader("Content-Type", "image/webp");
      return res.send(Buffer.from(blob));
    }
  }
}
