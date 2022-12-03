import {ArrowRightIcon} from "@heroicons/react/solid";
import {styled} from "@styles/theme";
import {Button} from "../Button";
import {Heading} from "../Typography/Headings";
import {LegibleText} from "../Typography/Text";

const TextContainer = styled("div", {
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	background: "$surface",
	display: "flex",
});

export default function LandingPageHeader() {
	return (
		<div
			className="flex items-center justify-center w-full p-4 md:p-8 py-12 lg:py-24 min-h-[520px]"
			style={{
				background: "url('/assets/hero-background.svg')",
				backgroundPosition: "center",
				backgroundSize: "contain",
				position: "relative",
			}}
		>
			<TextContainer>
				<div className="relative flex flex-col justify-center w-full max-w-4xl mx-auto">
					<div
						className="flex flex-col items-center text-center"
						style={{zIndex: "2"}}
					>
						<Heading
							size="xl"
							className="tracking-tight"
						>
							The ultimate platform for NSFW content
						</Heading>
						<LegibleText
							css={{fontSize: "21px"}}
							className="justify-center max-w-3xl mx-auto mt-12"
						>
							A safe and secure platform that allows NSFW content creators to
							earn money through subscriptions and NFTs
						</LegibleText>

						<div className="flex items-center justify-center max-w-lg gap-8 mt-12">
							<Button>
								Start exploring content{" "}
								<ArrowRightIcon
									style={{
										width: "1.2rem",
										height: "1.2rem",
										marginLeft: "0.5rem",
									}}
								/>
							</Button>
						</div>
					</div>
				</div>
			</TextContainer>
		</div>
	);
}
