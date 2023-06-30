import {XIcon} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";

export const ModalHeaderSection = ({title, onClose}) => {
	return (
		<Container
			className="flex justify-between items-center p-4 border-b w-[320px] md:w-[520px]"
			css={{backgroundColor: "$surface", borderColor: "$border"}}
		>
			<Heading size={"xss"}>{title}</Heading>
			<Button
				appearance={"default"}
				onClick={onClose}
				css={{borderRadius: "50%", padding: "8px", borderColor: "$border"}}
				className="border"
			>
				<XIcon className="w-5 h-5" />
			</Button>
		</Container>
	);
};
