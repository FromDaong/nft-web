const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const NFTSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Please add an NFT ID"],
      unique: "ID is already taken",
    },
    tx_hash: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Please add an NFT name"],
    },
    description: {
      type: String,
      required: [true, "Please add an NFT description"],
    },
    list_price: {
      type: Number,
    },
    external_url: {
      type: String,
      required: [true, "Please add an NFT external url"],
    },
    image: {
      type: String,
      required: [true, "Please add an NFT image"],
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
    totm: {
      type: Boolean,
    },
    totw: {
      type: Boolean,
    },
    melon_nft: {
      type: Boolean,
    },
    cdnUrl: {
      type: String,
    },
    old_totw: {
      type: Boolean,
    },
    old_totm: {
      type: Boolean,
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
    tags: [],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

NFTSchema.plugin(paginate);
NFTSchema.plugin(aggregatePaginate);

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
