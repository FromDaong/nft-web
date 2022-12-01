import BackgroundImage from "@packages/post/BackgroundImage";
import Blurhash from "@packages/post/Blurhash";
import {
	Heading,
	ImportantSmallText,
	Text,
} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";
import {Container} from "@packages/shared/components/Container";
import {TPost} from "./types";
import {
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {PostCardAction} from "./blocks";
import {DotsHorizontalIcon} from "@heroicons/react/outline";
import {PostMediaContent} from "./PostMediaContent";
import Avatar from "@packages/shared/components/AvatarNew";
import UserAvatar from "core/auth/components/Avatar";
import LiveTag from "@packages/feed/components/LiveTag";

export const CuratedNFt = (props: TPost) => {
	const imageUrl = props.image?.cdn;

	return (
		<Link href={`/post/${props.id}`}>
			<a>
				<Container
					className="flex flex-col border"
					css={{borderColor: "$subtleBorder", borderRadius: "16px"}}
				>
					<Container className="flex gap-4 p-4">
						<Link href={`/${props.author.username}/nfts`}>
							<a>
								<Container className="bg-gray-100 rounded-full">
									<UserAvatar
										size={40}
										value={props.author.display_name}
									/>
								</Container>
							</a>
						</Link>
						<Container className="flex-1">
							<Link href={`/${props.author.username}/nfts`}>
								<a>
									<Container className="flex items-center gap-2">
										<Text>{props.author.display_name}</Text>
										{props.author.live && <LiveTag />}
									</Container>
									<p>
										<MutedText>
											<SmallText>@{props.author.username}</SmallText>
										</MutedText>
									</p>
								</a>
							</Link>
						</Container>
					</Container>
					<Container
						className="relative shadow"
						style={{
							height: props.inGrid ? "360px" : "420px",
							width: "100%",
							overflow: "hidden",
							display: "flex",
						}}
					>
						<PostMediaContent
							imageUrl={imageUrl}
							blurhash={props.blurhash}
							caption={props.text}
							overrideText={
								"You have to collect this trit before you can preview its content"
							}
						/>
					</Container>
					<Container className="flex justify-between p-4">
						<Container className="flex-1">
							<p>
								<SmallText>
									Remaining {props.collection.minted}/
									{props.collection.totalSupply}
								</SmallText>
							</p>
							<p>
								<Heading size="xs">{props.collection.name}</Heading>
							</p>
						</Container>
						<Container className="text-right flex-noshrink">
							<p>
								<MutedText>
									<SmallText>Price</SmallText>
								</MutedText>
							</p>
							<Heading size="xs">
								{props.price.value} {props.price.currency}
							</Heading>
						</Container>
					</Container>
				</Container>
			</a>
		</Link>
	);
};
