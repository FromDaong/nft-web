import {apiEndpoint} from "@utils/index";
import axios from "axios";
import {useMemo, useState} from "react";

/**
 * @param
 */
export const useFollow = (
	my_id: string,
	username: string,
	followers: string[]
) => {
	const [profileFollowers, setProfileFollowers] = useState(followers);

	const isFollowing = useMemo(
		() => profileFollowers.includes(my_id),
		[my_id, profileFollowers]
	);

	const follow = () => {
		setProfileFollowers(followers.concat(my_id));
		axios.post(`${apiEndpoint}/profile/${username}/follow`).catch(() => {
			setProfileFollowers(followers.filter((id) => id !== my_id));
		});
	};

	const unfollow = () => {
		setProfileFollowers(followers.filter((id) => id !== my_id));

		axios.post(`${apiEndpoint}/profile/${username}/unfollow`).catch(() => {
			setProfileFollowers(followers.concat(my_id));
		});
	};

	return {
		isFollowing,
		follow,
		unfollow,
	};
};
