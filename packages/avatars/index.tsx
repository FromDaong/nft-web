import {Container} from "@packages/shared/components/Container";
import Avvvatars from "avvvatars-react";

export default function BorderAvatar({size}) {
	return (
		<Container
			css={{borderColor: "$totmPurple"}}
			className="p-1 bg-white border-4 rounded-full"
		>
			<Avvvatars
				value={Math.floor(Math.random() * 50).toString()}
				size={size}
				style="shape"
			/>
		</Container>
	);
}
