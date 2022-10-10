const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: "Username is already taken",
      required: [true, "Please add a username"],
    },
    wallet_address: {
      type: String,
      unique: "Wallet Address is already taken",
      required: [true, "Please add a Wallet Address"],
    },
    marketplace_items: [
      {
        id: String,
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

UserSchema.plugin(mongoosePaginate);

// ModelSchema.path("discount_codes")
//   .schema.path("newPrice")
//   .set(function (num) {
//     return num * 100;
//   });

// ModelSchema.path("price").set(function (num) {
//   return num * 100;
// });

ModelSchema.plugin(require("mongoose-beautiful-unique-validation"));

module.exports = mongoose.models.Model || mongoose.model("User", UserSchema);
