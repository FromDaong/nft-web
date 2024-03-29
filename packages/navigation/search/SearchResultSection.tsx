import {ReactNode} from "react";

export const SearchResultSection = ({
	children,
}: {
	heading: string;
	children: ReactNode;
}) => {
	return (
		<div className="flex flex-col w-full max-h-[480px] overflow-y-auto px-4 py-2">
			{children}
		</div>
	);
};
