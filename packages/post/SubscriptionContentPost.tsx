import {
	ImportantSmallText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Headings";
import {HeartIcon} from "@radix-ui/react-icons";
import {GiftIcon} from "@heroicons/react/solid";
import Link from "next/link";
import NewAvatar from "@packages/shared/components/AvatarNew";
import {PostMediaContent} from "./PostMediaContent";
import {TritPostProps} from "./types";
import {Container} from "@packages/shared/components/Container";
import {Button} from "@packages/shared/components/Button";
import {
	PostCardAction,
	PostCardCollectorsContainer,
	PostCardContainer,
	PostCardCreatorInfoContainer,
	PostCardMetaContainer,
} from "./blocks";
import {BookmarkIcon} from "@heroicons/react/outline";

export const SubscriptionContentPost = (props: TritPostProps) => {
	const imageUrl = props.image?.cdn;
	return (
		<PostCardContainer>
			<Container
				css={{
					display: "flex",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<Container
					className="gap-x-4"
					css={{display: "flex"}}
				>
					<Link href={props.author.username}>
						<a>
							<NewAvatar
								imageSrc={props.author.avatar}
								size_def={{height: "48px", width: "48px"}}
								username={props.author.display_name}
							/>
						</a>
					</Link>
					<Container>
						<PostCardCreatorInfoContainer>
							<div
								style={{
									display: "flex",
									columnGap: "12px",
									alignItems: "center",
								}}
							>
								<div>
									<Link href={props.author.username}>
										<a>
											<Text>{props.author.display_name}</Text>{" "}
											<SmallText>@{props.author.username}</SmallText> <br />
										</a>
									</Link>
								</div>
							</div>
						</PostCardCreatorInfoContainer>
						{props.text && (
							<PostCardMetaContainer>
								<Text>
									<ImportantSmallText>Uploaded</ImportantSmallText> to their
									timeline.{" "}
									<ImportantSmallText>{props.text}</ImportantSmallText>
								</Text>
							</PostCardMetaContainer>
						)}
						{props.text && (
							<PostCardMetaContainer>
								<Text></Text>
							</PostCardMetaContainer>
						)}
					</Container>
				</Container>
				<Container>
					<Button>Follow</Button>
				</Container>
			</Container>
			<Container
				className="mt-4 drop-shadow"
				css={{
					borderRadius: "16px",
					overflow: "hidden",
					border: "1px solid $subtleBorder",
					padding: "12px",
					position: "relative",
					height: "420px",
					width: "360px",
					backgroundColor: "$surface",
				}}
			>
				<Container
					className="relative w-full h-full "
					css={{borderRadius: "8px", overflow: "hidden"}}
				>
					<PostMediaContent
						caption={props.text}
						isProtected={false}
						_id={props._id}
					/>
				</Container>
			</Container>
			<Container className="flex gap-8 py-2 mt-4">
				<PostCardAction>
					<button>
						<HeartIcon className="w-6 h-6" />
					</button>
				</PostCardAction>
				<PostCardAction>
					<button>
						<GiftIcon className="w-6 h-6" />
					</button>
				</PostCardAction>
				<PostCardAction>
					<button>
						<BookmarkIcon className="w-6 h-6" />
					</button>
				</PostCardAction>
			</Container>
			{props.post_type === "colletible" && props.collected?.length > 0 && (
				<PostCardMetaContainer>
					<PostCardCollectorsContainer>
						<Text>
							Collected by{" "}
							<ImportantSmallText className="mx-1">
								{props.collected[0]?.user.username}
							</ImportantSmallText>{" "}
							{props.collected?.length > 0 && (
								<>
									and
									<ImportantSmallText className="mx-1">
										others
									</ImportantSmallText>
								</>
							)}
						</Text>
					</PostCardCollectorsContainer>
				</PostCardMetaContainer>
			)}
			{props.post_type === "subscription" && props.likes?.length > 0 && (
				<PostCardMetaContainer>
					<PostCardCollectorsContainer>
						<Text>
							Liked by{" "}
							<ImportantSmallText className="mx-1">
								{props.likes[0]?.user.username}
							</ImportantSmallText>{" "}
							{props.likes?.length > 0 && (
								<>
									and
									<ImportantSmallText className="mx-1">
										others
									</ImportantSmallText>
								</>
							)}
						</Text>
					</PostCardCollectorsContainer>
				</PostCardMetaContainer>
			)}
		</PostCardContainer>
	);
};
