const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema(
  {
    nft_id: {
      type: Number,
      required: [true, "Please add a NFT ID"],
    },
    seller: {
      type: String,
      required: [true, "Please add a NFT seller"],
    },
    expires_date: {
      type: String,
    },
    mint_id: {
      type: String,
      required: [true, "Please add a Mint ID"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// NFTSchema.path("discount_codes")
//   .schema.path("newPrice")
//   .set(function (num) {
//     return num * 100;
//   });

// NFTSchema.path("price").set(function (num) {
//   return num * 100;
// });

NFTSchema.plugin(require("mongoose-beautiful-unique-validation"));

module.exports = mongoose.models.NFT || mongoose.model("NFT", NFTSchema);
