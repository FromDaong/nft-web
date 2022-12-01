import {styled} from "@styles/theme";
import {Button} from "../../Button";
import {Container} from "../../Container";
import {ContextualHeading} from "../../Typography/Headings";
import {MutedText, Text} from "../../Typography/Text";

const backgrounds = {
	FAN: "url('/assets/backgrounds/fans_card_bg.jpeg')",
	CREATOR: "url('/assets/backgrounds/fans_card_bg.jpeg')",
};

const background_positions = {
	FAN: "center top",
	CREATOR: "left",
};

const Card = styled("div", {
	borderRadius: "16px",
	padding: "48px",
	minHeight: "480px",
	textAlign: "center !important",
	justifyContent: "space-between",
	position: "relative",
	display: "flex",
});

export const CardOverlay = styled("div", {
	position: "absolute",
	backgroundColor: "$overlay",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	backdropFilter: "blur(204px)",
	zIndex: 5,
});

export const Overlay = styled("div", {
	position: "absolute",
	backgroundColor: "$overlay",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	backdropFilter: "blur(204px)",
	zIndex: 300,
});

export const BenefitsCard = ({title, description, user_type}) => {
	return (
		<Card
			css={{
				backgroundPosition: background_positions[user_type],
				backgroundSize: "cover",
				backgroundColor: "$elementSurface",
			}}
			className="drop-shadow-lg"
		>
			<div className="flex flex-col justify-between w-full h-full">
				<div className="flex flex-col items-center w-full text-center">
					<MutedText>FOR {user_type}S</MutedText>
					<ContextualHeading>{title}</ContextualHeading>
					<Text>{description}</Text>
				</div>
				<Container className="flex justify-center">
					<Button css={{padding: "12px 24px"}}>
						<span>
							Get started as a <span className="lowercase">{user_type}</span>
						</span>
					</Button>
				</Container>
			</div>
		</Card>
	);
};
