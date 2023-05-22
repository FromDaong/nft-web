import {Container} from "@packages/shared/components/Container";
import {MutedText, Text} from "@packages/shared/components/Typography/Text";
import CreatorCard from "./SuggestedCreatorCard";

export default function SuggestedCreatorsSection(props: {
	title: string;
	data: Array<any>;
}) {
	return (
		<Container
			css={{backgroundColor: "$elementSurface", borderRadius: "16px"}}
			className="grid grid-cols-1 gap-4 p-4 shadow"
		>
			<Container>
				<Text>
					<MutedText>{props.title}</MutedText>
				</Text>
			</Container>
			<Container className="grid grid-cols-1 gap-4">
				{props.data.map((i) => (
					<CreatorCard
						key={i.username}
						username={i.username}
						display_name={i.display_name}
						avatar={i.profile_picture}
						bio={i.bio}
					/>
				))}
			</Container>
		</Container>
	);
}
