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

export default function SuggestedCreatorCard(props: SuggestedCreatorData) {
	console.log(props);
	return props.isExpanded ? (
		<ExpandSuggestedCreatorCard {...props} />
	) : (
		<CollapseSuggestedCreatorCard {...props} />
	);
}

const CollapseSuggestedCreatorCard = (props: SuggestedCreatorData) => {
	return (
		<Link href={`/${props.username}`}>
			<a>
				<Container
					css={{
						border: `1px ${props.border ? "solid" : null} $border`,
						padding: props.border ? "16px" : null,
						borderRadius: "16px",
						backgroundColor: "$surface",

						boxShadow: "$base",
						height: "auto",
					}}
					className="flex justify-between w-full"
				>
					<Container className="flex gap-2">
						<UserAvatar
							size={40}
							profile_pic={props.avatar}
						/>
						<Container className="gap-2">
							<Container>
								<p>
									<Text>
										<ImportantText>{props.display_name}</ImportantText>
									</Text>
								</p>
								<p className="text-ellipsis overflow-hidden ... w-[100px]">
									<MutedText>
										<SmallText>@{props.username}</SmallText>
									</MutedText>
								</p>
							</Container>
						</Container>
					</Container>
					{!props.noFollowButton && (
						<Container>
							<Button>Follow</Button>
						</Container>
					)}
				</Container>
			</a>
		</Link>
	);
};

const ExpandSuggestedCreatorCard = (props: SuggestedCreatorData) => {
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
							className="relative w-full h-[320px] flex items-center justify-center"
							css={{
								backgroundColor: "$elementOnSurface",
								backgroundImage: `url("${profilePicUrl}")`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						></Container>
						<Container className="flex flex-col gap-2 px-4">
							{props.username && (
								<Container className="flex flex-col w-full">
									<MutedText className="flex">
										<ImportantText>
											<SmallText>CREATOR</SmallText>
										</ImportantText>
									</MutedText>
									<Container className="flex items-center gap-4 ">
										<Heading
											size="xs"
											className="text-center"
										>
											<ImportantText>
												{props.username.replaceAll(" ", "").trim()}
											</ImportantText>
										</Heading>
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
						<Container className="px-4">
							<Button>View creator</Button>
						</Container>
					</Container>
				</Container>
			</a>
		</Link>
	);
};
