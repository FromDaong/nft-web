import {
	CashIcon,
	ChartBarIcon,
	ExternalLinkIcon,
	GiftIcon,
	HeartIcon,
	HomeIcon,
	PhotographIcon,
	UserGroupIcon,
} from "@heroicons/react/outline";
import {cn} from "@lib/utils";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {BoldLink} from "@packages/shared/components/Typography/Text";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import {StackIcon} from "@radix-ui/react-icons";
import {cva} from "class-variance-authority";
import {useUser} from "core/auth/useUser";
import {ShoppingBag} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/router";

function StudioNavigation() {
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
				<TabNavigationLink link={"/studio"}>
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

				<TabNavigationLink link={"/studio/nfts"}>
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
							<ShoppingBag className={"w-5 h-5"} />
							Sweetshop NFTs
						</Button>
					)}
				</TabNavigationLink>
			</Container>
		</Container>
	);
}

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

export default StudioNavigation;
