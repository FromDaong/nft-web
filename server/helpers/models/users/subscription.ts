import mongoose from "mongoose";
import createMongoDBModel from "../../utils";

export const HSubscriptionPackage = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      default: 0.1,
    },
    description: {
      type: String,
      required: true,
      default: "Monthly Subscription",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Creator",
    },
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const ModelSubscriptionPackage = createMongoDBModel(
  "Subscription",
  HSubscriptionPackage
);

export default ModelSubscriptionPackage;
