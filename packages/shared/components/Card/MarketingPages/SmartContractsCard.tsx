import Link from "next/link";
import {HeadlessCard} from "..";
import {Button} from "../../Button";
import {Container} from "../../Container";
import {ContextualHeading, Text} from "../../Typography/Headings";

export default function SmartContracts() {
	return (
		<HeadlessCard appearance={"gradient"}>
			<Container
				className="flex flex-col gap-8"
				style={{maxWidth: "60%"}}
			>
				<Container className="flex flex-col gap-4">
					<ContextualHeading>
						Verified, open-source projects from the TreatDAO team
					</ContextualHeading>
					<Text>
						TreatDAO is a community owned project built to life easier for
						content creators. All the contracts used on TreatDAO projects are
						open source and verified on supported blockchains.
					</Text>
				</Container>

				<Container>
					<Link href={"https://github.com/TreatDAODev"}>
						<a
							target={"_blank"}
							rel={"noopener"}
						>
							<Button css={{padding: "12px 24px"}}>Contribute on GitHub</Button>
						</a>
					</Link>
				</Container>
			</Container>
		</HeadlessCard>
	);
}
