import {Schema} from "mongoose";
import createMongoDBModel from "server/database/engine/utils";

export const Tag = createMongoDBModel(
	"Tag",
	new Schema({
		text: {
			type: String,
			required: true,
		},
	})
);
