const uploadcare = require("@uploadcare/upload-client");
const mongoose = require("mongoose");
const NFT = require("../models/NFT");
const Model = require("../models/Model");

const cdnclient = new uploadcare.UploadClient({
  publicKey: "bd2227cb6c142eeddfc0",
});

const main = async (doDocs, doModels) => {
  if (doDocs) {
    const docs = await NFT.find();
    for (const doc of docs) {
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
    console.log("[+] Processing model profile pictures");
    const docs = await Model.find();
    for (const doc of docs) {
      console.log("[+] Doing doc " + doc.id);
      if (!doc.cdnUrl) {
        try {
          const file = await cdnclient.uploadFile(doc.profile_pic);
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
    "mongodb+srv://dev:aMa2E0ArKPJwpmx1@cluster0.amea3.mongodb.net/treat?retryWrites=true&w=majority"
  )
  .then(() => main(false, true));
