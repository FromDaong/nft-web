import {GlobeAltIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Link from "next/link";
import {useRouter} from "next/router";
import {ReactNode} from "react";

const BankNotesIcon = ({width, height}) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		width={width}
		height={height}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
		/>
	</svg>
);

const NavTab = () => {
	const router = useRouter();

	const isActive = (route) => route === router.pathname;

	const Tab = ({
		route,
		label,
		icon,
	}: {
		route: string;
		label: string;
		icon: ReactNode;
	}) => (
		<Link href={route}>
			<a>
				<ImportantText
					className="px-8 py-2 items-center rounded-full flex gap-2"
					css={{
						backgroundColor: isActive(route)
							? "$elementOnSurface"
							: "elementSurface",
						color: isActive(route) ? "$textContrast" : "",
					}}
				>
					{icon}
					<p>{label}</p>
				</ImportantText>
			</a>
		</Link>
	);

	return (
		<Container
			className="flex mx-auto gap-4 shadow mt-6 sticky rounded-full"
			css={{
				boxShadow: "$shadow",
				overflow: "hidden",
				padding: "2px",
				backgroundColor: "$elementOnSurface",
			}}
		>
			<Tab
				label="Discover"
				route="/"
				icon={
					<GlobeAltIcon
						width={14}
						height={14}
					/>
				}
			/>
			<Tab
				label="Subscribed"
				route="/subscribed"
				icon={
					<BankNotesIcon
						width={14}
						height={14}
					/>
				}
			/>
		</Container>
	);
};

export default NavTab;
