import mongoose from "mongoose";
import createMongoDBModel from "../../utils";
import paginate from "mongoose-paginate-v2";

const ProfileSchema = new mongoose.Schema(
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
		identity_access_key: {
			type: String,
		},
		email: {
			type: String,
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
		isTeam: {
			type: Boolean,
			default: false,
		},
		isCouncil: {
			type: Boolean,
			default: false,
		},
		referred: [],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			ref: "User",
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Profile",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Profile",
			},
		],
	},
	{
		timestamps: {createdAt: true, updatedAt: true},
	}
);

ProfileSchema.plugin(paginate);

ProfileSchema.pre("findOne", function (next) {
	// Find badges and add them to the model
	next();
});

const ModelProfile = createMongoDBModel("Profile", ProfileSchema);
export default ModelProfile;
