// Create Context provider for the modal and the context provider for the modal

import {Modal, ModalHeaderSection} from "@packages/modals";
import {Container} from "@packages/shared/components/Container";

type NFTPageModalProps = {
	title: string;
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
};

export const NFTPageModal = ({
	children,
	isOpen,
	onClose,
	title,
}: NFTPageModalProps) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<NFTPageModal.Header
				onClose={onClose}
				title={title}
			/>
			<Container className="max-h-[32rem] overflow-y-auto">
				{children}
			</Container>
		</Modal>
	);
};

NFTPageModal.Header = ModalHeaderSection;
