import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Text";

export default function Owned({balance}) {
	if (balance === 0) return null;
	return (
		<Container className="w-full flex">
			<Text>{balance ?? 0}</Text>
		</Container>
	);
}
