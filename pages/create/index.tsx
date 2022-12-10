import CreateOptions from "@packages/create";
import {SEOHead} from "@packages/seo/page";
import {Button} from "@packages/shared/components/Button";
import {
	Container,
	ContextualContainer,
} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {
	ContextualHeading,
	ContextualHeadingContainer,
	Heading,
	Text,
} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";

export default function Create() {
	return (
		<ApplicationLayout>
			<SEOHead title="Create a new post" />
			<ApplicationFrame>
				<Container className="flex flex-col gap-8 py-12">
					<Container
						className="p-4 lg:p-8 rounded border shadow flex flex-col gap-8 max-w-xl"
						css={{background: "$elementSurface", borderRadius: "16px"}}
					>
						<Container className="flex flex-col gap-2">
							<Heading size="sm">Create new trits</Heading>
							<Text>
								Deploy a standard NFT contract that you can mint to at anytime.
								The following details are used to create your own smart
								contract.{" "}
							</Text>
						</Container>
						<Container className="flex flex-col gap-2">
							<Text>
								<ImportantText>Collection name</ImportantText>
							</Text>
							<Input />
						</Container>
						<Link href={"/create/988894"}>
							<a>
								<Button>Continue</Button>
							</a>
						</Link>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
