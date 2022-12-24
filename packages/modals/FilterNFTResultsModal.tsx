import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {Modal} from ".";

export default function FilterNFTResultsModal({isOpen, onClose}) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<Container className="flex flex-col gap-4">
				<Container className="flex flex-col gap-4 lg:min-w-[400px]">
					<Heading size="xs">Sort by</Heading>
					<Container className="grid grid-cols-1 gap-2">
						<Container className="flex justify-between items-center gap-2 py-3 rounded-[8px] px-4 bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer">
							<Text>
								<ImportantText>Reserve price</ImportantText>
							</Text>
							<Text>
								<ImportantText>Low to High</ImportantText>
							</Text>
						</Container>
						<Container className="flex justify-between items-center gap-2 py-3 px-4 rounded-[8px] bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer">
							<Text>
								<ImportantText>Date listed</ImportantText>
							</Text>
							<Text>
								<ImportantText>New to Old</ImportantText>
							</Text>
						</Container>
						<Container
							css={{backgroundColor: "$textContrast"}}
							className="flex justify-between items-center gap-2 py-3 px-4 rounded-[8px] hover:scale-105 transition-all duration-200 cursor-pointer"
						>
							<Text css={{color: "$surface"}}>
								<ImportantText>Random</ImportantText>
							</Text>
						</Container>
					</Container>
				</Container>
				<Divider dir={"horizontal"} />
				<Container className="flex flex-col gap-4">
					<Heading size="xs">Filter content</Heading>
					<Container className="grid grid-cols-1 gap-2">
						<Container className="flex justify-between items-center gap-2">
							<Container className="flex flex-col">
								<Text>
									<ImportantText>Sold out</ImportantText>
								</Text>
								<MutedText>Include content that has been sold out</MutedText>
							</Container>
							<input type="checkbox" />
						</Container>
						<Container className="flex justify-between items-center gap-2">
							<Container className="flex flex-col">
								<Text>
									<ImportantText>Secondary market</ImportantText>
								</Text>
								<MutedText>Include content from the resale market</MutedText>
							</Container>
							<input type="checkbox" />
						</Container>
						<Container className="flex justify-between items-center gap-2">
							<Container className="flex flex-col">
								<Text>
									<ImportantText>Subscription</ImportantText>
								</Text>
								<MutedText>Include content from your subscriptions</MutedText>
							</Container>
							<input type="checkbox" />
						</Container>
					</Container>
				</Container>
				<Divider dir={"horizontal"} />
				<Container className="flex justify-between">
					<Button
						onClick={onClose}
						appearance={"subtle"}
					>
						Cancel
					</Button>
					<Button>Show 300 results</Button>
				</Container>
			</Container>
		</Modal>
	);
}
