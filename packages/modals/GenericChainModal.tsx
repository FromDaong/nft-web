import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import Spinner from "@packages/shared/icons/Spinner";
import {ReactNode} from "react";
import {Modal, ModalHeaderSection} from ".";
import {MutedText} from "@packages/shared/components/Typography/Text";

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
	buttonAppearance?: string;
}) {
	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<Container className="flex flex-col gap-8 p-4 lg:p-8 w-full">
				<Container>
					<Heading size={"xs"}>{props.title}</Heading>
					<MutedText>{props.subtitle}</MutedText>
				</Container>

				{props.children}
				{props.loading && (
					<Container className="flex justify-center my-8">
						<Spinner />
					</Container>
				)}

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
								<Button
									appearance={(props.buttonAppearance as any) ?? "default"}
									onClick={props.action}
								>
									{props.buttonLabel}
								</Button>
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
