const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const ReactionsSchema = new mongoose.Schema({
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
});

ReactionsSchema.plugin(aggregatePaginate);
ReactionsSchema.plugin(paginate);
ReactionsSchema.plugin(require("mongoose-beautiful-unique-validation"));

const ReactionModel =
  mongoose.models.ReactionsSchema ||
  mongoose.model("Reaction", ReactionsSchema);
export default ReactionModel;
