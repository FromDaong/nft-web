import {Container} from "@packages/shared/components/Container";
import React, {ReactNode} from "react";

type ActionSectionProps = {
	children: ReactNode;
};

export default function ActionSection(props: ActionSectionProps) {
	return (
		<Container className="flex flex-shrink-0 gap-2">{props.children}</Container>
	);
}
