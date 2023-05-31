import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import DynamicSkeleton from "@packages/skeleton";
import {FeaturedCreatorSkeleton} from "@packages/skeleton/config";
import UserAvatar from "core/auth/components/Avatar";
import Link from "next/link";
import LiveTag from "./LiveTag";
import {UserPlus} from "lucide-react";
import Avvvatars from "avvvatars-react";
import Username from "./Username";

type SuggestedCreatorData = {
	username: string;
	display_name: string;
	avatar: string;
	isPromoted?: boolean;
	isExpanded?: boolean;
	border?: boolean;
	live?: boolean;
	noFollowButton?: boolean;
	bio: string;
	noBg?: boolean;
	followers?: number;
	subscribers?: number;
};

export const SkeletonExpandedSuggestedCreatorCard = (props) => (
	<DynamicSkeleton config={FeaturedCreatorSkeleton} />
);

export default function CreatorCard(props: SuggestedCreatorData) {
	return <DefaultCreatorCard {...props} />;
}

const DefaultCreatorCard = (props: SuggestedCreatorData) => {
	// T-83 Some profile pics not loading. Use base treatnfts.com - media endpoint /api/v3/media/
	const profilePicUrl = props.avatar;

	return (
		<Link href={`/${props.username}`}>
			<a>
				<Container
					css={{
						border: `1px ${props.border ? "solid" : null} $border`,
						borderRadius: "16px",
						backgroundColor: "$surfaceOnSurface",

						boxShadow: "$base",
						height: "100%",
					}}
					className="pb-4 overflow-hidden"
				>
					<Container className="flex flex-col justify-between w-full gap-4">
						<Container
							className="relative p-4 overflow-hidden w-full h-[320px] flex border-b items-center justify-center"
							css={{
								backgroundImage: `url("${profilePicUrl}")`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								backgroundColor: "$surface",
								borderColor: "$border",
							}}
						>
							{!props.avatar && (
								<Avvvatars
									size={320}
									style="shape"
									value={props.username}
									radius={16}
								/>
							)}
						</Container>
						<Container className="flex flex-col gap-2 px-4">
							{props.username && (
								<Container className="flex flex-col w-full">
									<MutedText className="flex">
										<ImportantText>
											<SmallText>CREATOR</SmallText>
										</ImportantText>
									</MutedText>
									<Container className="flex items-center gap-4 ">
										<Username
											username={props.username.replaceAll(" ", "").trim()}
											verified={true}
										/>
										{props.live && <LiveTag />}
									</Container>
								</Container>
							)}
							{props.isPromoted && (
								<Container className="flex flex-col gap-2">
									{props.isPromoted && (
										<p>
											<MutedText css={{color: "$accentText"}}>
												<SmallText>Promoted</SmallText>
											</MutedText>
										</p>
									)}
								</Container>
							)}
						</Container>
						<Container className="flex gap-4 px-4">
							<Button>
								<UserPlus className="w-5 h-5" /> Follow
							</Button>
						</Container>
					</Container>
				</Container>
			</a>
		</Link>
	);
};
