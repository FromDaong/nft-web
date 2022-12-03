import {CurrencyDollarIcon} from "@heroicons/react/outline";
import {styled} from "@styles/theme";
import {CardDetailSection, HeadlessCard} from "..";
import {Button} from "../../Button";
import {Container} from "../../Container";
import {ContextualHeading, Heading, Text} from "../../Typography/Headings";
import {BoldLink} from "../../Typography/Text";
import TreatOfTheMonthCard from "./TreatOfTheMonthCard";

const VideoContainer = styled("div", {
	height: "65vh",
});

export default function TreatOfTheMonth() {
	const tom_images = [
		"https://cdn.pixabay.com/photo/2016/12/23/22/08/woman-1928071_960_720.jpg",
		"https://nftevening.com/wp-content/uploads/2022/01/kinkify-girl-nft.gif",
		"https://nftevening.com/wp-content/uploads/2022/01/kinkify-girl-nft.gif",
		"https://nftevening.com/wp-content/uploads/2022/01/kinkify-girl-nft.gif",
		"https://nftevening.com/wp-content/uploads/2022/01/kinkify-girl-nft.gif",
		"https://nftevening.com/wp-content/uploads/2022/01/kinkify-girl-nft.gif",
		"https://nftevening.com/wp-content/uploads/2022/01/kinkify-girl-nft.gif",
		"https://nftevening.com/wp-content/uploads/2022/01/kinkify-girl-nft.gif",
	];
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
			<Container>
				<TreatOfTheMonthCard images={tom_images} />
			</Container>
		</>
	);
}
