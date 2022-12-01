import {PostMediaContent} from "./PostMediaContent";
import {LivestreamPost, TPost} from "./types";
import {Container} from "@packages/shared/components/Container";
import {Button} from "@packages/shared/components/Button";
import {LiveMediaPostContainer} from "./blocks";
import {LivestreamMediaContainer} from "./LivestreamMediaContainer";

export const LivestreamingPostCard = (props: LivestreamPost) => {
	const imageUrl = props.image?.cdn;
	return (
		<LiveMediaPostContainer className="py-8">
			<LivestreamMediaContainer
				css={{position: "relative", display: "flex", borderRadius: "16px"}}
			>
				<Container
					className="p-12"
					css={{
						display: "flex",
						justifyContent: "space-between",
						width: "100%",
						position: "absolute",
						bottom: 0,
						left: 0,
					}}
				>
					<Container>
						<Button>Subscribe</Button>
					</Container>
				</Container>
				<PostMediaContent
					imageUrl={imageUrl}
					blurhash={props.blurhash}
					overrideText={"Subscribe to join livestream"}
					caption={props.text}
				/>
			</LivestreamMediaContainer>
		</LiveMediaPostContainer>
	);
};
