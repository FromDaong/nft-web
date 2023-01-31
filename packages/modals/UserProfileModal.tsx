import {Container} from "@packages/shared/components/Container";
import {Modal} from ".";

export default function UserProfileModal(props: {
	address: string;
	isOpen: boolean;
	onClose: () => void;
}) {
	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<Container className="flex flex-col w-full"></Container>
		</Modal>
	);
}
