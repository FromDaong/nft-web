const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    display_name: {
      type: String,
    },
    username: {
      type: String,
      unique: "Username is already taken",
      required: [true, "Please add a Model username"],
    },
    bio: {
      type: String,
      required: [true, "Please add a Model bio"],
    },
    totw: {
      type: Boolean,
    },
    totw_end: {
      type: Date,
    },
    profile_pic: {
      type: String,
    },
    banner_pic: {
      type: String,
      default:
        "https://treatdao.mypinata.cloud/ipfs/QmdRewQfGbQP95hcyabRwRnXKWFH8Lyrr8ak6xc2y4uWTP",
    },
    social_account: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    pending: {
      type: Boolean,
    },
    rejected: {
      type: Boolean,
    },
    hidden: {
      type: Boolean,
    },
    referrer_address: {
      type: String,
    },
    identity_access_key: {
      type: String,
    },
    nfts: [
      {
        id: String,
      },
    ],
    sub_nfts: [
      {
        id: String,
      },
    ],
    subscription: {
      price: {
        type: Number,
      },
      description: {
        type: String,
      },
      enabled: {
        type: Boolean,
      },
    },
    referred: [],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// ModelSchema.path("discount_codes")
//   .schema.path("newPrice")
//   .set(function (num) {
//     return num * 100;
//   });

// ModelSchema.path("price").set(function (num) {
//   return num * 100;
// });

ModelSchema.plugin(require("mongoose-beautiful-unique-validation"));

module.exports = mongoose.models.Model || mongoose.model("Model", ModelSchema);
