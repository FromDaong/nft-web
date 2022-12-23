import mongoose from "mongoose";
import createMongoDBModel from "../../utils";

const AnalyticsSchema = new mongoose.Schema(
	{
		event_type: {
			type: String,
			required: true,
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

const ModelAnalytics = createMongoDBModel("Analytics", AnalyticsSchema);
export default ModelAnalytics;
