import {CurrencyDollarIcon} from "@heroicons/react/outline";
import {styled} from "@styles/theme";
import UserAvatar from "core/auth/components/Avatar";
import {CardDetailSection, HeadlessCard} from "..";
import {Button} from "../../Button";
import {ContextualHeading, Heading, Text} from "../../Typography/Headings";
import {BoldLink, MutedText} from "../../Typography/Text";

const VideoContainer = styled("div", {
	height: "65vh",
});

export default function TreatOfTheMonth() {
	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
					width: "100%",
				}}
			>
				<CardDetailSection>
					<Heading
						size="lg"
						css={{color: "$textContrast"}}
					>
						Meet our{" "}
						{
							// return current month
							new Date().toLocaleString("default", {month: "long"})
						}{" "}
						<br /> Treat of The Month
					</Heading>
				</CardDetailSection>
			</div>
			<VideoContainer className="grid w-full grid-cols-5 gap-8 p-8 mt-4 rounded-xl">
				<div className="flex-1 col-span-5 bg-gray-100 lg:col-span-3 rounded-xl"></div>
				<div className="col-span-5 lg:col-span-2">
					<div className="flex mt-8">
						<div className="flex items-center w-1/2 gap-4">
							<UserAvatar
								value={"TreatDAOOfficial"}
								size={48}
							/>
							<div>
								<MutedText>Featuring</MutedText>
								<BoldLink>Cherie Noel</BoldLink>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div>
								<MutedText>Reserve Price</MutedText>
								<BoldLink>0.90 BNB</BoldLink>
							</div>
						</div>
					</div>
					<div className="w-full mt-8">
						<Button
							css={{padding: "12px 24px"}}
							className="flex justify-center w-full text-center"
						>
							Purchase set for 5.0 BNB
						</Button>
					</div>
				</div>
			</VideoContainer>
		</>
	);
}
