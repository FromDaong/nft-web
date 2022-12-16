import BorderAvatar from "@packages/avatars";
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
				<Container className="flex flex-col max-w-4xl gap-12 px-4 py-12 mx-auto">
					<Container className="flex flex-col gap-4 pt-24 text-center">
						<Container className="flex items-center justify-center gap-1 mb-8">
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
						</Container>
						<Heading size="lg">
							Introducing the TreatDAO Creator Collaboration Platform{" "}
						</Heading>
						<Text css={{fontSize: "21px"}}>
							The TreatDAO Creator Collaboration Marketplace is a place where
							creators can collaborate with other creators to create NFTs.
						</Text>
					</Container>
					<Container className="flex justify-center">
						<Button className="px-8 py-3">Join the waitlist</Button>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}