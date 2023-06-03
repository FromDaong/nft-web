import {XIcon} from "@heroicons/react/outline";
import {treatOldGraphClient} from "@lib/graphClients";
import {Modal, ModalHeaderSection} from "@packages/modals";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	Text,
} from "@packages/shared/components/Typography/Text";
import {Link1Icon, Link2Icon} from "@radix-ui/react-icons";
import Link from "next/link";
import {Provider} from "urql";

export default function TransactionHistoryTray({isOpen, onClose}) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<Container>
				<ModalHeaderSection
					title={"Transaction history"}
					onClose={onClose}
				/>
				<Provider value={treatOldGraphClient}>
					<Container
						className="p-4 flex flex-col gap-8"
						css={{background: "$surfaceOnSurface"}}
					>
						<MutedText>
							<ImportantText>
								Transactions done on the TreatDAO platform will be shown here
							</ImportantText>
						</MutedText>
						<Link href={""}>
							<a className="flex flex-col w-full">
								<Button appearance={"surface"}>
									View more transactions on Bscscan
									<Link2Icon />
								</Button>
							</a>
						</Link>
					</Container>
				</Provider>
			</Container>
		</Modal>
	);
}

const TransactionsContainer = () => {
	return <Container className="flex flex-col gap-1"></Container>;
};
const TransactionHistoryItem = ({}) => {
	return <Container></Container>;
};
