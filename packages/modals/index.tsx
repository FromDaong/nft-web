import {styled} from "@styles/theme";
import {Dialog} from "@headlessui/react";
import {Text} from "@packages/shared/components/Typography/Text";
import {ReactNode} from "react";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {Button} from "@packages/shared/components/Button";
import {XIcon} from "@heroicons/react/outline";

export const DialogOverlay = styled("div", {
	backgroundColor: "var(--blackA9)",
	position: "fixed",
	inset: 0,
	animation: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
	zIndex: 1100,
	backdropFilter: "blur(8px)",
});

export const DialogContent = styled(Dialog.Panel, {
	backgroundColor: "$surface",
	boxShadow:
		"hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
	position: "fixed",

	// maxWidth: "720px",
	height: "fit-content",
	animation: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
	zIndex: 1200,
	minWidth: "360px",
	overflow: "hidden",
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
	compact,
}: {
	isOpen: boolean;
	onClose: (props?: any) => any;
	children: ReactNode;
	compact?: boolean;
}) => {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
		>
			<DialogOverlay />

			{
				//@ts-ignore
				<DialogContent
					className={
						"md:top-[50%] md:left-[50%] md:translate-x-[-50%] md:translate-y-[-50%] bottom-0 left-0 w-full md:w-[520px] rounded-t-xl md:rounded-xl h-fit max-h-[80vh]"
					}
				>
					<Container className={"md:w-[520px] w-full overflow-y-auto"}>
						{children}
					</Container>
				</DialogContent>
			}
		</Dialog>
	);
};

export const ModalHeaderSection = ({title, onClose}) => {
	return (
		<Container
			className="flex justify-between items-center p-2 lg:p-4 border-b"
			css={{backgroundColor: "$surface", borderColor: "$border"}}
		>
			<Heading size={"xss"}>{title}</Heading>
			<Button
				appearance={"surface"}
				onClick={onClose}
				css={{borderRadius: "50%", padding: "8px", borderColor: "$border"}}
				className="border"
			>
				<XIcon className="w-5 h-5" />
			</Button>
		</Container>
	);
};
