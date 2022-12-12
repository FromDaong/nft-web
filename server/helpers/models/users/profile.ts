import mongoose from "mongoose";
import createMongoDBModel from "../../utils";
import paginate from "mongoose-paginate-v2";

const ModelSchema = new mongoose.Schema(
	{
		display_name: {
			type: String,
			default: "",
		},
		username: {
			type: String,
			unique: "Username is already taken",
			required: [true, "Please add a Model username"],
		},
		bio: {
			type: String,
			required: [true, "Please add a Model bio"],
		},
		profile_pic: {
			type: String,
			default: "",
		},
		banner_pic: {
			type: String,
			default:
				"https://treatdao.mypinata.cloud/ipfs/QmdRewQfGbQP95hcyabRwRnXKWFH8Lyrr8ak6xc2y4uWTP",
		},
		social_accounts: {
			twitter: {
				type: String,
				default: "",
			},
			website: {
				type: String,
				default: "",
			},
			instagram: {
				type: String,
				default: "",
			},
		},
		address: {
			type: String,
			required: [true, "Please add an address"],
			unique: [true, "Address is already taken"],
		},
		referrer_address: {
			type: String,
		},
		collected_nfts: [
			{
				id: String,
			},
		],
		badges: [
			{
				label: String,
				color: String,
			},
		],
		referred: [],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

ModelSchema.plugin(paginate);

ModelSchema.pre("findOne", function (next) {
	// Find badges and add them to the model
	next();
});

const ModelProfile = createMongoDBModel("Profile", ModelSchema);
export default ModelProfile;
