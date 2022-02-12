import UploadClient from "@uploadcare/upload-client";

const uploadcare = new UploadClient({ publicKey: "bd2227cb6c142eeddfc0" });

export default function migrate(req, res) {
  uploadcare
    .uploadFile(
      "https://treatdao.mypinata.cloud/ipfs/QmXwqx7sk6FoA1WX9cbXrXWnSJMpnuPYCKH3DNwpGBADiK"
    )
    .then((file) => res.json(file));
}
