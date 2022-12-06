import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function Error500() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<Container className="flex justify-center w-full h-full py-32">
					<Container className="flex flex-col gap-2">
						<Heading size="md">Error 500</Heading>
						<Text>Oops! That was an error</Text>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
