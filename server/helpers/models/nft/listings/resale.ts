import {Schema, model} from "mongoose";
import {Document} from "mongoose";
import createMongoDBModel from "../../../utils";

interface ResaleListing extends Document {
	price: number;
	quantity: number;
	seller: string;
	sales: {
		buyer: string;
		timestamp: number;
	};
	nft: any;
}

const ResaleListingSchema = new Schema({
	price: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	seller: {
		type: String,
		required: true,
	},
	sales: {
		buyer: {
			type: String,
			required: true,
		},
		timestamp: {
			type: Number,
			required: true,
		},
	},
	nft: {
		type: Schema.Types.ObjectId,
		ref: "V2NFT",
		required: true,
	},
});

const ResaleListingModel = createMongoDBModel<ResaleListing>(
	"ResaleListing",
	ResaleListingSchema
);

export default ResaleListingModel;
