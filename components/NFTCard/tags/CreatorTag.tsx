import Link from "next/link";
import {FrostyBackgroundContainer} from "../misc/FrostyBackground";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";

function CreatorTag({avatar, username}) {
	return (
		<Link href={`/${username}`}>
			<a>
				<FrostyBackgroundContainer className="flex items-center gap-2 p-2 rounded-full">
					<img
						src={avatar}
						className="object-cover w-6 h-6 overflow-hidden rounded-full"
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
