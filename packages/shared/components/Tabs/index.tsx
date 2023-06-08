import {ComponentBasicProps} from "core/TreatCore";
import Link from "next/link";
import {useRouter} from "next/router";
import {Button} from "../Button";
import {Container} from "../Container";
import {Text} from "../Typography/Text";
import {ReactNode} from "react";

export const TabsContainer = ({children}: ComponentBasicProps) => {
	return (
		<Container
			css={{
				borderBottom: "1px solid $subtleBorder",
				borderTop: "1px solid $subtleBorder",
			}}
			variant={"unstyled"}
			className="flex w-full px-2 overflow-x-auto"
		>
			<Container className="container flex w-full mx-auto gap-x-2 flex-start">
				{children}
			</Container>
		</Container>
	);
};

export const ActionTab = ({children, isActive}) => {
	return (
		<Container
			css={{
				marginY: "12px",
				backgroundColor: isActive ? "$elementOnSurface" : "$surface",
				borderRadius: "8px",
				padding: "8px 12px",
			}}
			className={`relative rounded-full`}
		>
			{children}
		</Container>
	);
};

export const Tab = ({
	label,
	href,
	icon,
}: {
	label: string;
	href: string;
	icon?: ReactNode;
}) => {
	const {asPath} = useRouter();
	const withoutParams = asPath.split("?")[0];
	const isActive = href === withoutParams;

	return (
		<Container
			css={{
				marginY: "12px",
				backgroundColor: isActive ? "$elementOnSurface" : "$surface",
				borderRadius: "8px",
				padding: "8px 12px",
			}}
			className={`relative rounded-full`}
		>
			<Link href={href}>
				<a className="flex items-center gap-2">
					<Text
						css={{
							color: isActive ? "$textContrast" : "$text",
							fontWeight: isActive ? 700 : 500,
						}}
						className="flex items-center gap-2"
					>
						{icon}
						{label}
					</Text>
				</a>
			</Link>
		</Container>
	);
};
