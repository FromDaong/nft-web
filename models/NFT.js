const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a NFT name"],
    },
    description: {
      type: String,
      required: [true, "Please add a NFT description"],
    },
    external_url: {
      type: String,
      required: [true, "Please add a NFT external url"],
    },
    image: {
      type: String,
      required: [true, "Please add a NFT image"],
    },
    attributes: [
      {
        trait_type: { type: String, required: true },
        value: { type: String, required: true }
      },
    ],
    model_bnb_address: {
      type: String,
      required: [true, "PLease add models bnb address"]
    },
    mints: []
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

module.exports =
  mongoose.models.NFT || mongoose.model("NFT", NFTSchema);
