import {Dialog} from "@headlessui/react";
import {DialogOverlay} from "..";
import {styled} from "@styles/theme";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {Button} from "@packages/shared/components/Button";
import {XIcon} from "@heroicons/react/outline";
import {CopyIcon} from "@radix-ui/react-icons";

type ImagePreviewProps = {
	url: string;
	onClose: () => void;
	isOpen: boolean;
	title: string;
};

export const DialogContent = styled(Dialog.Panel, {
	backgroundColor: "$surface",
	borderRadius: "0",
	boxShadow:
		"hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
	position: "fixed",
	top: "0",
	left: "0",
	width: "100dvw",
	height: "100dvh",
	animation: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
	zIndex: 1200,
	overflow: "hidden",
	padding: "1.2rem",
});

export default function FullscreenImagePreviewModal(props: ImagePreviewProps) {
	return (
		<Dialog
			open={props.isOpen}
			onClose={props.onClose}
		>
			<DialogOverlay />

			{
				//@ts-ignore
				<DialogContent>
					<Container className="flex flex-col w-full h-full gap-8">
						<Container className="container flex justify-between mx-auto">
							<Heading size={"xss"}>{props.title}</Heading>
							<Button
								appearance={"surface"}
								css={{padding: "8px"}}
								onClick={props.onClose}
							>
								<XIcon className="w-5 h-5" />
							</Button>
						</Container>
						<Container className="flex items-center justify-center flex-1">
							<img
								src={props.url}
								sizes="100vw"
								alt={props.title}
								className="h-auto max-h-full shadow-xl aspect-auto rounded-xl"
							/>
						</Container>
						<Container className="container flex justify-center gap-4 mx-auto">
							<Button appearance={"surface"}>
								<CopyIcon className="w-5 h-5" />
								Copy link
							</Button>
						</Container>
					</Container>
				</DialogContent>
			}
		</Dialog>
	);
}
