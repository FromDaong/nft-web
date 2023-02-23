import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import Link from "next/link";
import {useRouter} from "next/router";

const tabs = [
	{
		label: "Sweetshop",
		href: "/sweetshop",
	},
	{
		label: "Resale Market",
		href: "/sweetshop/resale",
	},
];

export default function SweetshopTabs() {
	const router = useRouter();

	return (
		<Container
			css={{
				backgroundColor: "$elementOnSurface",
				border: "$border",
			}}
			className="flex gap-2 p-1 border rounded-full"
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
						borderRadius: "9999px",
					}}
					className="transition-all duration-200 rounded-xl"
				>
					{label}
				</Button>
			</a>
		</Link>
	);
};
