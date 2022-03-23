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
});

ProfileSchema.plugin(aggregatePaginate);
ProfileSchema.plugin(paginate);
ProfileSchema.plugin(require("mongoose-beautiful-unique-validation"));

const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
export default Profile;
