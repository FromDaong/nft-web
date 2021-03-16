import { isEmail } from "validator";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const BrandSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add a username"],
    unique: "Username is already taken",
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail, "invalid email"],
    unique: "Email is already used",
  },
  support_email: {
    type: String,
    required: true,
    validate: [isEmail, "invalid email"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
  },
  disable_new_verifications: {
    type: Boolean,
    required: true,
    default: false,
  },
  payments: {
    stripe_account: {
      type: String,
    },
    charges_enabled: {
      type: Boolean,
      default: false,
    },
    total_earned: {
      type: Number,
      deault: 0,
    },
    all_payments: {
      type: Array,
      default: [],
    },
    all_payment_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchase",
      },
    ],
  },
});

BrandSchema.plugin(require("mongoose-beautiful-unique-validation"));

BrandSchema.pre("save", function (next) {
  var brand = this;

  // only hash the password if it has been modified (or is new)
  if (!brand.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(brand.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      brand.password = hash;
      next();
    });
  });
});

BrandSchema.methods.comparePassword = function (candidatePassword, cb) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

module.exports = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
