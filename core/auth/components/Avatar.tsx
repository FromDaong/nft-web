import NewAvatar from "@packages/shared/components/AvatarNew";
import Avvvatars from "avvvatars-react";

export default function UserAvatar(props: {
	data?: {
		username: string;
		display_name?: string;
		avatar: string;
		bio?: string;
		closeFollowers?: Array<{
			username: string;
		}>;
	};
	size: number;
	username?: string;
	profile_pic?: string;
}) {
	if (props.profile_pic) {
		return (
			<NewAvatar
				imageSrc={props.profile_pic}
				username={props.username}
				size={props.size}
			/>
		);
	}

	return (
		<Avvvatars
			size={props.size}
			value={props.data?.avatar ?? props.username}
		/>
	);
}
