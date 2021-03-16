import { isEmail } from "validator";
import { boolean } from "yup";
const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema(
  {
    user_account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
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
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

PurchaseSchema.plugin(require("mongoose-beautiful-unique-validation"));

module.exports =
  mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);
