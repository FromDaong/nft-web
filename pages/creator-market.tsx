import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function CreatorMarket() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title={"Introducing the Creator Marketplace"} />
				<Container className="flex flex-col gap-12">
					<Container className="flex flex-col gap-4 text-center">
						<Heading size="md">
							Introducing the TreatDAO Creator Collaboration Marketplace{" "}
						</Heading>
						<Text css={{fontSize: "21px"}}>
							The TreatDAO Creator Collaboration Marketplace is a place where
							creators can collaborate with other creators to create NFTs.
						</Text>
					</Container>
					<Container className="flex justiyf-center">
						<Button>Join the waitlist</Button>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
