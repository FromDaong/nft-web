import {ComponentBasicProps} from "core/TreatCore";
import Link from "next/link";
import {useRouter} from "next/router";
import {Button} from "../Button";
import {Container} from "../Container";
import {ImportantText} from "../Typography/Text";

export const TabsContainer = ({children}: ComponentBasicProps) => {
	return (
		<Container
			css={{borderBottom: "1px solid $border"}}
			variant={"unstyled"}
			className="flex w-full gap-x-4 flex-start"
		>
			{children}
		</Container>
	);
};

export const Tab = ({
	label,
	href,
	count,
}: {
	label: string;
	href: string;
	count?: number;
}) => {
	const {asPath} = useRouter();
	const isActive = asPath === href;

	return (
		<Container
			css={{
				marginBottom: "12px",
				backgroundColor: isActive ? "$elementSurface" : "$elementOnSurface",
				borderRadius: "9999px",
				padding: "8px 12px",
			}}
			className={`relative rounded-full`}
		>
			<Link href={href}>
				<a className="flex gap-2 items-center">
					<ImportantText css={{color: isActive ? "$textOnSurface" : "$text"}}>
						{label}
					</ImportantText>
					{(count || count === 0) && (
						<Button
							appearance={"subtle"}
							css={{padding: "2px 8px", fontSize: "12px"}}
						>
							{count}
						</Button>
					)}
				</a>
			</Link>
		</Container>
	);
};
