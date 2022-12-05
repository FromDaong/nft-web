import {ArrowRightIcon} from "@heroicons/react/solid";
import Link from "next/link";

export default function ListingSection({title, href, children}) {
	return (
		<div className="px-4 my-24 md:px-8 xl:px-0">
			<div className="w-full">
				<div className="flex items-baseline justify-between">
					<h2 className="text-xl font-medium text-gray-900 md:text-3xl">
						{title}
					</h2>
					<Link href={href}>
						<a className="flex items-center gap-2 text-sm">
							View more <ArrowRightIcon className="w-5 h-5" />
						</a>
					</Link>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 mt-12 md:grid-cols-2 lg:grid-cols-3">
				{children}
			</div>
		</div>
	);
}

export const InfinityScrollListing = ({children}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{children}
		</div>
	);
};
