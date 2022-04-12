const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const MessagesSchema = new mongoose.Schema({
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

MessagesSchema.plugin(aggregatePaginate);
MessagesSchema.plugin(paginate);
MessagesSchema.plugin(require("mongoose-beautiful-unique-validation"));

const Message =
  mongoose.models.MessagesSchema || mongoose.model("Message", MessagesSchema);
export default Message;
