import * as uploadcare from "@uploadcare/upload-client";

const cdnclient = new uploadcare.UploadClient({
  publicKey: "bd2227cb6c142eeddfc0",
});

export default function migrate(req, res) {
  cdnclient
    .uploadFile("https://treatdao.com/assets/bg.jpg")
    .then((file) => res.json(file));
}
