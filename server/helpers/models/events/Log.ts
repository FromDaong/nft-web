import mongoose from "mongoose";
import createMongoDBModel from "../../utils";

const LogSchema = new mongoose.Schema(
	{
		status: {
			type: String,
			required: true,
			enum: ["critical", "error", "warning", "info"],
		},
		metadata: {
			type: String,
			required: true,
		},
		timestamp: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

const ModelLog = createMongoDBModel("Log", LogSchema);
export default ModelLog;
