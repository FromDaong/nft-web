const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const BanSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  expires: {
    type: Number,
  },
  channel: {
    type: String,
    required: true,
  },
});

BanSchema.plugin(aggregatePaginate);
BanSchema.plugin(paginate);
BanSchema.plugin(require("mongoose-beautiful-unique-validation"));

const Block = mongoose.models.Ban || mongoose.model("Ban", BanSchema);
export default Block;
