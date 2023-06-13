import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import Footer from "@packages/shared/components/Footer";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function OnRamp() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Buy Crypto - Treat" />
				<Container className="flex flex-col gap-8 py-24">
					<Container>
						<iframe
							width="100%"
							height="800px"
							src="https://flooz.trade/embedded/0x01bd7acb6fF3B6Dd5aefA05CF085F2104f3fC53F?backgroundColor=transparent&lightMode=true&refId=ikUONy"
						/>
					</Container>
				</Container>
			</ApplicationFrame>
			<Footer />
		</ApplicationLayout>
	);
}
