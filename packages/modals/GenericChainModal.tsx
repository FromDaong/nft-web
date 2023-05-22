import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import Spinner from "@packages/shared/icons/Spinner";
import {ReactNode} from "react";
import {Modal, ModalHeaderSection} from ".";
import {Portal} from "@radix-ui/react-portal";

export default function GenericChainModal(props: {
	title?: string;
	children?: ReactNode;
	noButton?: boolean;
	isOpen: boolean;
	onClose: any;
	hideClose?: boolean;
	buttonLabel?: string;
	action?: any;
	subtitle?: string | ReactNode;
	loading?: boolean;
	noTitle?: boolean;
}) {
	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<ModalHeaderSection onClose={props.onClose} title={!props.noTitle && (props.title || "Action Complete ✅ 💝")} />

			<Container className="flex flex-col gap-8 p-8 w-[320px] md:w-[520px]">
				{props.subtitle && <Container className={"flex max-w-full"}>
						{props.subtitle}
				</Container>}

				{!props.noButton && (
					<Container className="flex justify-end gap-8">
						{!props.hideClose && (
							<Button
								appearance={"subtle"}
								onClick={props.onClose}
							>
								Cancel
							</Button>
						)}

						{props.buttonLabel &&
							(!props.loading ? (
								<Button onClick={props.action}>{props.buttonLabel}</Button>
							) : (
								<Button
									disabled
									appearance={"disabled"}
								>
									<Spinner />
									<span>Please wait...</span>
								</Button>
							))}
					</Container>
				)}
			</Container>
		</Modal>
	);
}
