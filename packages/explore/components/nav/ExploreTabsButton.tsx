import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import Link from "next/link";
import {useRouter} from "next/router";

const tabs = [
	{
		label: "For you",
		href: "/explore/for-you",
	},
	{
		label: "Discover",
		href: "/explore/discover",
	},
];

export default function ExploreTabsButton() {
	const router = useRouter();

	return (
		<Container
			css={{
				backgroundColor: "$elementOnSurface",
			}}
			className="shadow p-2 rounded-lg flex gap-2"
		>
			{tabs.map((tab) => (
				<TabButton
					{...tab}
					key={tab.href}
					isActive={router.pathname === tab.href}
				/>
			))}
		</Container>
	);
}

const TabButton = ({label, isActive, href}) => {
	return (
		<Link href={href}>
			<a>
				<Button
					appearance={"unstyled"}
					css={{
						background: isActive ? "$buttonSurface" : "transparent",
						color: isActive ? "$textOnSurface" : "$text",
						padding: "8px 12px",
					}}
					className="transition-all duration-200 rounded-xl"
				>
					{label}
				</Button>
			</a>
		</Link>
	);
};
