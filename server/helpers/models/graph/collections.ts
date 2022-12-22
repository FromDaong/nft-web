import createMongoDBModel from "../../utils";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import {Schema} from "mongoose";

const CollectionSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		creator: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Creator",
		},
		profile: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Profile",
		},
		cover_image: {
			type: String,
		},
		nfts: [
			{
				type: Schema.Types.ObjectId,
				ref: "MarketplaceNFT",
			},
		],
		isSubscription: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{
		timestamps: {
			createdAt: true,
			updatedAt: true,
		},
	}
);

CollectionSchema.plugin(paginate);
CollectionSchema.plugin(aggregatePaginate);

const CollectionModel = createMongoDBModel("NFTCollection", CollectionSchema);

export default CollectionModel;
