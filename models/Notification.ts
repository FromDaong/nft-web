import { Schema, model, models } from "mongoose";
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const NotificationsSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  sent: {
    type: Boolean,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  },
});

NotificationsSchema.plugin(aggregatePaginate);
NotificationsSchema.plugin(paginate);
NotificationsSchema.plugin(require("mongoose-beautiful-unique-validation"));

const NotificationModel =
  models.NotificationsSchema || model("Notification", NotificationsSchema);
export default NotificationModel;
