// search results list section with heading and children

import {Heading} from "@packages/shared/components/Typography/Headings";
import {Text} from "@packages/shared/components/Typography/Text";
import {ReactNode} from "react";

export const SearchResultSection = ({
	children,
}: {
	heading: string;
	children: ReactNode;
}) => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-col w-full">{children}</div>
		</div>
	);
};
