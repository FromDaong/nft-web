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

const Media = (props, imageUrl) => (
	<PostMediaContent
		imageUrl={imageUrl}
		blurhash={props.blurhash}
		caption={props.text}
		overrideText={
			"The creator wants you to collect this trit before you can preview the content"
		}
	/>
);

export const TritPost = (props: TPost) => {
	const imageUrl = props.image?.cdn;

	return (
		<Link href={`/post/${props.id}`}>
			<a>
				<Container
					className="flex border shadow relative overflow-hidden"
					css={{
						borderColor: "$subtleBorder",
						borderRadius: "16px",
						backgroundColor: "$surface",
					}}
				></Container>
			</a>
		</Link>
	);
};
