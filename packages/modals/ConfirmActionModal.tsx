import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {Modal} from ".";

export default function ConfirmActionModal({
	isOpen,
	onClose,
	action_verb,
	action,
}: {
	isOpen: boolean;
	onClose: () => any;
	action_verb: string;
	action: () => void;
}) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<Container className="flex flex-col gap-4">
				<Heading size="xs">Are you sure you want to {action_verb}?</Heading>
				<Container className="flex w-full justify-end gap-4">
					<Button
						appearance={"surface"}
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						appearance={"action"}
						onClick={action}
					>
						Continue
					</Button>
				</Container>
			</Container>
		</Modal>
	);
}
