import {neodeDB} from "@db/engine";
import Profile from ".";

const ProfileModel = neodeDB.model("Profile", Profile);

export const createProfile = async () => {
	const profile = await ProfileModel.create({
		username: "Kamfeskaya",
		address: "9282fu39j3fj93f",
		bio: "Here",
	});

	return profile;
};

export const followUser = async (profile_id: string, actor: string) => {
	const followee = await ProfileModel.find(profile_id);
	const follower = await ProfileModel.find(actor);

	await follower.relateTo(followee, "follows");
};
