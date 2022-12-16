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
				<SEOHead title={"Insiders - TreatDAO"} />
				<Container className="flex flex-col max-w-4xl gap-12 px-4 py-12 mx-auto">
					<Container className="flex flex-col gap-4 pt-24 text-center">
						<Container className="flex items-center justify-center gap-2 mb-8">
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
							<BorderAvatar size={64} />
						</Container>
						<Heading size="lg">
							Building next-gen tools for
							<br /> adult content creators
						</Heading>
						<Text css={{fontSize: "18px"}}>
							TreatDAO insiders are members of the community who build, test and{" "}
							<br />
							suggest new features first before they are rolled out to everyone.
						</Text>
					</Container>
					<Container className="flex justify-center">
						<Button css={{padding: "16px 48px"}}>Apply to be an insider</Button>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
