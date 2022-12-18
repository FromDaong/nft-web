import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";

type CancelActionProps = {
	title: string;
	subtitle?: string;
	backAction: () => void;
	nextAction: () => void;
};

export default function CancelAction(props: CancelActionProps) {
	return (
		<Container className="w-full p-4 flex flex-col gap-12">
			<Container className="flex flex-col gap-2">
				<Heading size="xs">{props.title}</Heading>
				<Text>{props.subtitle}</Text>
			</Container>
			<Container className="grid grid-cols-2 gap-6">
				<Button onClick={props.backAction}>No, go back</Button>
				<Button onClick={props.nextAction}>Yes, cancel</Button>
			</Container>
		</Container>
	);
}
