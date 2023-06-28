import React from "react";
import {ExclamationCircleIcon, HomeIcon} from "@heroicons/react/outline";
import {cn} from "@lib/utils";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {useUser} from "core/auth/useUser";
import {CircleSlash, ShoppingBag, Verified} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/router";

const BackofficeNavigation = () => {
	const router = useRouter();
	const {pathname} = router;
	const {creator, isLoading} = useUser();

	if (isLoading) return null;

	return (
		<Container
			className={"w-full flex gap-2 sticky top-0 z-30 border-b"}
			css={{backgroundColor: "$surface", borderColor: "$border"}}
		>
			<Container className="flex gap-2 overflow-x-auto">
				<TabNavigationLink link={"/backoffice"}>
					{(isActive) => (
						<Button
							css={{
								padding: "8px 12px",
								borderColor: "$purple10",
								color: isActive ? "$purple11" : "$text",
								borderRadius: 0,
							}}
							appearance={"unstyled"}
							className={cn(isActive && "border-b-2")}
						>
							<HomeIcon className={"w-5 h-5"} />
							Home
						</Button>
					)}
				</TabNavigationLink>

				<TabNavigationLink link={"/backoffice/pending"}>
					{(isActive) => (
						<Button
							css={{
								padding: "8px 12px",
								borderColor: "$purple10",
								color: isActive ? "$purple11" : "$text",
								borderRadius: 0,
							}}
							appearance={"unstyled"}
							className={cn(isActive && "border-b-2")}
						>
							<ExclamationCircleIcon className={"w-5 h-5"} />
							Pending creators
						</Button>
					)}
				</TabNavigationLink>

				<TabNavigationLink link={"/backoffice/rejected"}>
					{(isActive) => (
						<Button
							css={{
								padding: "8px 12px",
								borderColor: "$purple10",
								color: isActive ? "$purple11" : "$text",
								borderRadius: 0,
							}}
							appearance={"unstyled"}
							className={cn(isActive && "border-b-2")}
						>
							<CircleSlash className={"w-5 h-5"} />
							Rejected creators
						</Button>
					)}
				</TabNavigationLink>
			</Container>
		</Container>
	);
};

export function TabNavigationLink({children, link}) {
	const router = useRouter();
	const {pathname} = router;
	const isActive = pathname === link;

	return (
		<Link href={link}>
			<a>{children(isActive)}</a>
		</Link>
	);
}

export default BackofficeNavigation;
