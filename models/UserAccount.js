import { isEmail } from "validator";

const mongoose = require("mongoose");

const UserAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your full name"],
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail, "invalid email"],
    },
    socials: {
      instagram: {
        type: String,
      },
      telegram: {
        type: String,
      },
    },
    identification: {
      type: String,
      required: [true, "Please add an identification image"],
    },
    selfie: {
      type: String,
      required: [true, "Please add a selfie with your ID"],
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    verification: {
      verified: {
        type: Boolean,
        default: false,
      },
      rejected: {
        type: Boolean,
        default: false,
      },
      verified_at: {
        type: Date,
      },
      rejected_at: {
        type: Date,
      },
      can_retry: {
        type: Boolean,
        default: false,
      },
    },
    purchases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchase",
        required: true,
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

UserAccountSchema.plugin(require("mongoose-beautiful-unique-validation"));

module.exports =
  mongoose.models.UserAccount ||
  mongoose.model("UserAccount", UserAccountSchema);
