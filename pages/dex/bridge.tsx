import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function OnRamp() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Buy Crypto - Treat" />
				<Container className="flex flex-col gap-8 py-12">
					<Container className="flex flex-col gap-2">
						<Heading size="sm">Buy Crypto</Heading>
						<Text>
							You can buy BNB easily through floorz.trade's widget below. Use
							BNB throughout the Treat site or purchase $TREAT.
						</Text>
					</Container>
					<Container>
						<iframe
							width="100%"
							height="800px"
							src="https://flooz.trade/embedded/0x01bd7acb6fF3B6Dd5aefA05CF085F2104f3fC53F?backgroundColor=transparent&lightMode=true&refId=ikUONy"
						/>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
