// search results list section with heading and children

import {Text} from "@packages/shared/components/Typography/Text";
import {ReactNode} from "react";

export const SearchResultSection = ({
	heading,
	children,
}: {
	heading: string;
	children: ReactNode;
}) => {
	return (
		<div className="flex flex-col w-full">
			<div className="flex items-center justify-between w-full">
				<Text
					css={{
						color: "$text",
						fontWeight: 600,
					}}
				>
					{heading}
				</Text>
			</div>
			<div className="flex flex-col w-full">{children}</div>
		</div>
	);
};
