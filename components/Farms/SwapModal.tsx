import {Modal, ModalHeaderSection} from "@packages/modals";

export default function SwapModal({isOpen, onClose, title}) {
	if (!isOpen) {
		return null;
	}
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<ModalHeaderSection
				title={title}
				onClose={onClose}
			/>
		</Modal>
	);
}
