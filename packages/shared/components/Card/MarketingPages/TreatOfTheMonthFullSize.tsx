import {Container} from "../../Container";
import NewAvatar from "../../AvatarNew";
import {ImportantSmallText} from "../../Typography/Headings";
import {MutedText} from "../../Typography/Text";
import {Heading} from "../../Typography/Headings";

export default function TreatOfTheMonthFullSize({image}) {
	return (
		<Container
			className="overflow-hidden"
			style={{
				height: "420px",
				width: "100%",
				borderColor: "$subtleBorder",
				borderRadius: "16px",
			}}
		>
			<img
				src={image}
				height="420px"
			/>
		</Container>
	);
}
