import {styled} from "@styles/theme";
import {Dialog, Transition} from "@headlessui/react";
import {Text} from "@packages/shared/components/Typography/Text";
import {Fragment, ReactNode} from "react";

export const DialogOverlay = styled("div", {
	backgroundColor: "var(--blackA9)",
	position: "fixed",
	inset: 0,
	animation: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
	zIndex: 1100,
});

export const DialogContent = styled(Dialog.Panel, {
	backgroundColor: "white",
	borderRadius: "6px",
	boxShadow:
		"hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
	position: "fixed",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "90vw",
	maxWidth: "450px",
	maxHeight: "85vh",
	padding: "25px",
	animation: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
	zIndex: 1200,
});

export const DialogTitle = styled(Dialog.Title, {
	margin: 0,
	fontWeight: 500,
	fontSize: "17px",
	color: "$textContrast",
});

export const DialogDescription = styled(Text, {
	margin: "10px 0 20px",
	color: "$text",
	linHeight: 1.5,
});

export const Modal = ({
	isOpen,
	onClose,
	children,
}: {
	isOpen: boolean;
	onClose: (props?: object) => any;
	children: ReactNode;
}) => {
	return (
		<Transition
			as={Fragment}
			show={isOpen}
		>
			<Dialog
				open={isOpen}
				onClose={onClose}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<DialogOverlay />
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<DialogContent>{children}</DialogContent>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
};
