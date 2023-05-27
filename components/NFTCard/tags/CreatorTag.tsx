import Link from "next/link";
import {FrostyBackgroundContainer} from "../misc/FrostyBackground";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import UserAvatar from "core/auth/components/Avatar";

function CreatorTag({avatar, username}) {
	return (
		<Link href={`/${username}`}>
			<a>
				<FrostyBackgroundContainer className="flex items-center gap-2 p-2 rounded-full">
					<UserAvatar
						username={username}
						profile_pic={avatar}
						size={20}
					/>
					<Text
						css={{
							color: "$white",
						}}
					>
						<ImportantText>@{username}</ImportantText>
					</Text>
				</FrostyBackgroundContainer>
			</a>
		</Link>
	);
}

export default CreatorTag;
