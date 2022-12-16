import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import Spinner from "@packages/shared/icons/Spinner";
import {ReactNode} from "react";
import {Modal} from ".";

export default function GenericChainModal(props: {
	title?: string;
	children?: ReactNode;
	noButton?: boolean;
	isOpen: boolean;
	onClose: any;
	hideClose?: boolean;
	buttonLabel?: string;
	action?: any;
	subtitle?: string;
	loading?: boolean;
}) {
	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<Container className="flex flex-col gap-8">
				<Container className="flex flex-col gap-2 w-full">
					<Heading size="xs">{props.title || "Action Complete ✅ 💝"}</Heading>
					<Text>{props.subtitle}</Text>
				</Container>
				{props.children && <Container>{props.children}</Container>}
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
