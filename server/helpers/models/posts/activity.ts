import mongoose from "mongoose";
import createMongoDBModel from "../../core/utils";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const NFTEventSchema = new mongoose.Schema(
	{
		id: {
			type: Number,
			required: true,
		},
		seller: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		listDate: {
			type: Number,
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: false},
	}
);

NFTEventSchema.plugin(paginate);
NFTEventSchema.plugin(aggregatePaginate);

const NFTEvent = createMongoDBModel("NFTEvent", NFTEventSchema);

export default NFTEvent;
