import {Schema} from "mongoose";

const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const ChatSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: "Profile",
			},
		],
	},
	{
		timestamps: {createdAt: true, updatedAt: false},
	}
);

ChatSchema.plugin(aggregatePaginate);
ChatSchema.plugin(paginate);

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
export default Chat;
