// tailwind layout component with sidebar and main {children}

import {Container} from "@packages/shared/components/Container";
import {ReactNode} from "react";

export const StudioLayout = ({children}: {children: ReactNode}) => {
	return (
		<Container>
			<div className="flex flex-col md:flex-row">
				<div className="w-full md:w-1/4">
					<div className="bg-gray-800 text-gray-100 px-2 py-4">
						<div className="flex items-center justify-between">
							<div className="text-3xl font-semibold">Studio</div>
						</div>
					</div>
				</div>
				<div className="w-full md:w-3/4">
					<div className="bg-gray-100 text-gray-900 px-2 py-4">{children}</div>
				</div>
			</div>
		</Container>
	);
};
