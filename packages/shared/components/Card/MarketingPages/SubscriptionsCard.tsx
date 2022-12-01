import {ArrowRightIcon} from "@heroicons/react/solid";
import {CardDetailSection, HeadlessCard} from "..";
import {Button} from "../../Button";
import {Container} from "../../Container";
import {ContextualHeading, Text} from "../../Typography/Headings";

export default function SubscriptionsCard() {
	return (
		<HeadlessCard className="shadow-lg">
			<Container
				className="flex flex-col gap-8"
				style={{maxWidth: "60%", zIndex: 1}}
			>
				<Container className="flex flex-col gap-4">
					<ContextualHeading>
						Recurring on-chain payments, ever heard of them?
					</ContextualHeading>
					<Text>
						TreatDAO is a community owned project built to life easier for
						content creators. All the contracts used on TreatDAO projects are
						open source and verified on supported blockchains.
					</Text>
				</Container>

				<Container>
					<Button css={{padding: "12px 24px"}}>
						Find out how we do it{" "}
						<ArrowRightIcon
							style={{
								height: "1.1rem",
								width: "1.1rem",
								marginLeft: "0.8rem",
							}}
						/>
					</Button>
				</Container>
			</Container>
		</HeadlessCard>
	);
}
