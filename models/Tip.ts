const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const TipsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

TipsSchema.plugin(aggregatePaginate);
TipsSchema.plugin(paginate);
TipsSchema.plugin(require("mongoose-beautiful-unique-validation"));

const Tip = mongoose.models.TipsSchema || mongoose.model("Tip", TipsSchema);
export default Tip;
