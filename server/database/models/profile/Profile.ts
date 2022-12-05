import createMongoDBModel from "server/database/engine/utils";

const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const paginate = require("mongoose-paginate-v2");

const ProfileSchema = new mongoose.Schema({
	display_name: {
		type: String,
	},
	username: {
		type: String,
		unique: "Username is already taken",
		required: [true, "Please add a Profile username"],
	},
	bio: {
		type: String,
		required: [true, "Please add a Profile bio"],
	},
	address: {
		type: String,
	},
	banner_pic: {
		type: String,
		default:
			"https://treatdao.mypinata.cloud/ipfs/QmdRewQfGbQP95hcyabRwRnXKWFH8Lyrr8ak6xc2y4uWTP",
	},
});

ProfileSchema.plugin(aggregatePaginate);
ProfileSchema.plugin(paginate);
ProfileSchema.plugin(require("mongoose-beautiful-unique-validation"));

const Profile = createMongoDBModel("Profile", ProfileSchema);
export default Profile;
