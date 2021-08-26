const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
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
    identity_access_key: {
      type: String,
    },
    nfts: [
      {
        id: String,
      },
    ],
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
