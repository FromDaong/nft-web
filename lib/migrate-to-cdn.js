const uploadcare = require("@uploadcare/upload-client");
const mongoose = require("mongoose");
const NFT = require("../models/NFT");
const Model = require("../models/Model");
const fetch = require("node-fetch");

const cdnclient = new uploadcare.UploadClient({
  publicKey: "890dd88a3677206c36d1",
});

function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

const main = async (doDocs, doModels) => {
  if (doDocs) {
    const nft_docs = await NFT.find();
    console.log("[+] Got NFTs " + nft_docs.length);
    for (const doc of nft_docs.reverse()) {
      console.log("[+] Doing doc " + doc.id);
      if (!doc.cdnUrl) {
        try {
          const file = await cdnclient.uploadFile(doc.image);

          console.log("[+] Uploaded file " + file.cdnUrl);
          doc.cdnUrl = file.cdnUrl;
          await new NFT(doc).save();
          console.log("✅ Done doc " + doc.id);
        } catch (err) {
          console.log("⚠️  Error uploading file: " + err);
        }
      } else {
        console.log("⏩ Already has cdnUrl for doc " + doc.id);
      }
    }
  }

  if (doModels) {
    const docs = await Model.find();
    console.log("[+] Got models " + docs.length);

    for (const doc of docs) {
      console.log("[+] Doing doc " + doc.id);
      if (!doc.profilePicCdnUrl) {
        try {
          const file = await cdnclient.uploadFile(doc.image);

          console.log("[+] Uploaded file " + file.cdnUrl);
          doc.profilePicCdnUrl = file.cdnUrl;
          await new Model(doc).save();
          console.log("✅ Done doc " + doc.id);
        } catch (err) {
          console.log("⚠️  Error uploading file: " + err);
        }
      } else {
        console.log("⏩ Already has cdnUrl for doc " + doc.id);
      }
    }
  }
};

//main();

mongoose
  .connect(
    "mongodb+srv://vercel:JQc7KIP793qFXFC5@treatcluster.9uuso.mongodb.net/treat?retryWrites=true&w=majority"
  )
  .then(() => main(true, true));
