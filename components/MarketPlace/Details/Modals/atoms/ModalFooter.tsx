import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {ReactNode} from "react";

type ModalHeaderSectionProps = {
	onClose: () => void;
	children: ReactNode;
};

export const ModalFooterSection = ({
	onClose,
	children,
}: ModalHeaderSectionProps) => {
	return (
		<Container
			className="flex justify-between items-center p-4"
			css={{borderColor: "$border"}}
		>
			<Button
				appearance={"subtle"}
				onClick={onClose}
				className="border"
			>
				Cancel
			</Button>
			{children}
		</Container>
	);
};
