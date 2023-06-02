import {Schema} from "mongoose";
import {Document} from "mongoose";
import createMongoDBModel from "../../../utils";

interface Listing extends Document {
	price: number;
	quantity: number;
	seller: string;
	sales: {
		buyer: string;
		timestamp: number;
	};
	nft: any;
	listing_type: "melon" | "totm" | "verified";
}

const ListingSchema = new Schema({
	price: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	seller: {
		type: Schema.Types.ObjectId,
		ref: "Creator",
		required: true,
	},
	listing_type: {
		type: String,
		required: true,
		default: "verified",
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

const ListingModel = createMongoDBModel<Listing>("Listing", ListingSchema);

export default ListingModel;
