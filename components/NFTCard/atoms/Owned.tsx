import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import React from "react";

export default function Owned({balance}) {
	console.log({balance});
	return (
		<Container className="w-full flex">
			<Button
				appearance={"surface"}
				size={"sm"}
			>
				{balance ?? 0} nfts owned
			</Button>
		</Container>
	);
}
