import {apiEndpoint} from "@utils/index";
import axios from "axios";
import TreatCore from "core/TreatCore";
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

	const invalidate = () => TreatCore.queryClient.invalidateQueries(["profile"]);

	const follow = () => {
		setProfileFollowers(followers.concat(my_id));
		axios
			.post(`${apiEndpoint}/profile/${username}/follow`)
			.catch(() => {
				setProfileFollowers(followers.filter((id) => id !== my_id));
			})
			.then(invalidate);
	};

	const unfollow = () => {
		setProfileFollowers(followers.filter((id) => id !== my_id));

		axios
			.post(`${apiEndpoint}/profile/${username}/unfollow`)
			.catch(() => {
				setProfileFollowers(followers.concat(my_id));
			})
			.then(invalidate);
	};

	return {
		isFollowing,
		follow,
		unfollow,
	};
};
