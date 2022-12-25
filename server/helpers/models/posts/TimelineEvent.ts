import mongoose from "mongoose";
import createMongoDBModel from "../../core/utils";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const NFTActivitySchema = new mongoose.Schema(
	{
		profile: {
			type: String,
			required: true,
		},
		verb: {
			type: Number,
		},
		timestamp: {
			type: Number,
			default: new Date().getTime(),
		},
		action: {
			verb: [String],
			subjects: [String],
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: false},
	}
);

NFTActivitySchema.plugin(paginate);
NFTActivitySchema.plugin(aggregatePaginate);

const TimelineEvent = createMongoDBModel("TimelineEvent", NFTActivitySchema);

export default TimelineEvent;
