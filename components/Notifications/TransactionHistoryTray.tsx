import {XIcon} from "@heroicons/react/outline";
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
							<Button appearance={"default"}>
								View more transactions on Bscscan
								<Link2Icon />
							</Button>
						</a>
					</Link>
				</Container>
			</Container>
		</Modal>
	);
}
