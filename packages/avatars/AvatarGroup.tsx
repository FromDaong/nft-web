import {Container} from "@packages/shared/components/Container";
import UserAvatar from "core/auth/components/Avatar";
import Link from "next/link";

const AvatarGroup = (props: {
	users: {
		imageUrl: string;
		href: string;
		name: string;
		size?: number;
	}[];
	size?: number;
}) => {
	return (
		<Container className={`flex gap-[${(props.size ?? 24) * 0.5}px]`}>
			{props.users.slice(0, 4).map((profile, index) => (
				<Link
					key={profile.href}
					href={profile.href}
				>
					<a className={index !== 0 ? `-ml-4` : ""}>
						<Container
							css={{
								borderColor: "$surface",
								backgroundColor: "elementOnSurface",
							}}
							className={"rounded-full border-2"}
						>
							<UserAvatar
								username={profile.name}
								profile_pic={profile.imageUrl}
								size={props.size ?? 24}
							/>
						</Container>
					</a>
				</Link>
			))}
		</Container>
	);
};

export default AvatarGroup;
