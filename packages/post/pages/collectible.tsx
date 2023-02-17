import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";

export default function CreateCollectiblePage() {
	return (
		<Container className="flex flex-col gap-8">
			<form action="upload">
				<Container
					className="p-4 lg:p-8 rounded border shadow flex flex-col gap-8 max-w-xl"
					css={{background: "$elementSurface", borderRadius: "16px"}}
				>
					<Container className="flex flex-col gap-1">
						<Heading size="sm">Create new NFTs</Heading>
						<Text>
							Deploy a standard NFT contract that you can mint to at anytime.
							The following details are used to create your own smart contract.{" "}
						</Text>
					</Container>
					<Container>
						<Text>
							<ImportantText>Collection name</ImportantText>
							<Input />
						</Text>
					</Container>
					<Button>Continue</Button>
				</Container>
			</form>
		</Container>
	);
}
