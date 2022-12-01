import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";

export default function LiveTag() {
	return (
		<Button
			className="flex items-center gap-2"
			appearance={"danger"}
		>
			<Container
				css={{backgroundColor: "$red9"}}
				className="w-2 h-2 rounded-full"
			/>
			Live
		</Button>
	);
}
