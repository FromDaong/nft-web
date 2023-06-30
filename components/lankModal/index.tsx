import GenericChainModal from "@packages/modals/GenericChainModal";

export const BlankModal = ({
	show,
	handleClose,
	title,
	subtitle,
	buttonAction,
	buttonLabel,
	noButton,
	hideClose,
}: {
	show: boolean;
	handleClose: () => void;
	title: string;
	subtitle?: string;
	buttonAction?: () => void;
	buttonLabel?: string;
	noButton?: boolean;
	hideClose?: boolean;
}) => {
	return (
		<GenericChainModal
			isOpen={show}
			onClose={handleClose}
			title={title}
			subtitle={subtitle}
			action={buttonAction}
			buttonLabel={buttonLabel}
			noButton={noButton}
			hideClose={hideClose}
		/>
	);
};
