const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
    },
    description: {
      type: String,
      required: [true, "Please add a product description"],
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Please add a password"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    total_earned: {
      type: Number,
      default: 0,
    },
    discount_codes: [
      {
        code: { type: String, required: true },
        newPrice: { type: Number, required: true },
        usedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        usedAmount: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

ProductSchema.path("discount_codes")
  .schema.path("newPrice")
  .set(function (num) {
    return num * 100;
  });

ProductSchema.path("price").set(function (num) {
  return num * 100;
});

ProductSchema.plugin(require("mongoose-beautiful-unique-validation"));

module.exports =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
