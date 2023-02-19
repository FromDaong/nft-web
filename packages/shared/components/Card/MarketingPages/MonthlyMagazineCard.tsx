import Link from "next/link";
import {CardDetailSection, HeadlessCard} from "..";
import {Button} from "../../Button";
import {Container} from "../../Container";
import {ContextualHeading, Text} from "../../Typography/Headings";
import {Overlay} from "./BenefitsCard";

export default function MonthlyMagazine() {
	return (
        <HeadlessCard appearance={"gradient"}>
			<Container
				className="flex flex-col gap-8"
				style={{maxWidth: "60%"}}
			>
				<Container className="flex flex-col gap-4">
					<ContextualHeading>
						Guess what. We have a magazine we think you'll love
					</ContextualHeading>
					<Text>
						TreatDAO is a community owned project built to life easier for
						content creators. All the contracts used on TreatDAO projects are
						open source and verified on supported blockchains.
					</Text>
				</Container>

				<Container>
					<Link href={"/magazine"}>

                        <Button css={{padding: "12px 24px"}}>
                            Explore TreatDAO magazines
                        </Button>

                    </Link>
				</Container>
			</Container>
		</HeadlessCard>
    );
}
