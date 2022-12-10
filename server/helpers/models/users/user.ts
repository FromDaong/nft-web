import mongoose from "mongoose";
import createMongoDBModel from "../../utils";
import paginate from "mongoose-paginate-v2";

const ModelSchema = new mongoose.Schema(
	{
		address: {
			type: String,
			required: true,
		},
		email: {
			type: String,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		deleted: {
			type: Boolean,
			defaut: false,
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

ModelSchema.plugin(paginate);

const ModelUser = createMongoDBModel("User", ModelSchema);
export default ModelUser;
