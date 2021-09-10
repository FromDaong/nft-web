const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Please add a NFT ID"],
    },
    name: {
      type: String,
      required: [true, "Please add a NFT name"],
    },
    description: {
      type: String,
      required: [true, "Please add a NFT description"],
    },
    list_price: {
      type: Number,
      required: [true, "Please add a NFT list price"],
    },
    external_url: {
      type: String,
      required: [true, "Please add a NFT external url"],
    },
    image: {
      type: String,
      required: [true, "Please add a NFT image"],
    },
    blurhash: {
      type: String,
    },
    model_handle: {
      type: String,
      required: [true, "Please add Model's social handle"],
    },
    max_supply: {
      type: String,
      required: [true, "Please add max supply"],
    },
    model_profile_pic: {
      type: String,
    },
    subscription_nft: {
      type: Boolean,
    },
    attributes: [
      {
        trait_type: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    model_bnb_address: {
      type: String,
      required: [true, "PLease add models bnb address"],
    },
    mints: [
      {
        transactionHash: String,
        nftId: Number,
        buyer: String,
        price: String,
        timestamp: String,
      },
    ],
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
