import { isEmail } from "validator";
import { boolean } from "yup";
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
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
    instagram: {
      type: String,
    },
    telegram: {
      type: String,
    },
    identification: {
      type: String,
      required: [true, "Please add an identification image"],
    },
    selfie: {
      type: String,
      required: [true, "Please add a selfie with your ID"],
    },
    product: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
      },
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
    purchase: {
      has_purchased: {
        type: Boolean,
        default: false,
      },
      purchased_at: {
        type: Date,
      },
      qr_code: {
        id: {
          type: String,
        },
        used: {
          type: Boolean,
          default: false,
        },
        used_at: {
          type: Date,
        },
      },
      client_secret: {
        type: String,
      },
      charge_id: {
        type: String,
      },
      refund: {
        type: String,
      },
      refund_at: {
        type: Date,
      },
      payment_intent: {
        type: String,
      },
      discount_code: {
        type: String,
      },
      discount_new_price: {
        type: Number,
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

UserSchema.plugin(require("mongoose-beautiful-unique-validation"));

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
