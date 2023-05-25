// Create Context provider for the modal and the context provider for the modal

import {Modal, ModalHeaderSection} from "@packages/modals";

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
			{children}
		</Modal>
	);
};

NFTPageModal.Header = ModalHeaderSection;
