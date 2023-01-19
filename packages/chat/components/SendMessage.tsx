import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";

export default function SendMessage() {
	return (
		<Container className="flex gap-8">
			<Input className="w-full" />
			<Container className="flex-1"></Container>
		</Container>
	);
}
