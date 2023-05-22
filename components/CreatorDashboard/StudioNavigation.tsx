import {
	ChartBarIcon,
	ExternalLinkIcon,
	GiftIcon,
	HeartIcon,
	HomeIcon,
	PhotographIcon,
} from "@heroicons/react/outline";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {BoldLink} from "@packages/shared/components/Typography/Text";
import RectangleStack from "@packages/shared/icons/RectangleStack";
import {StackIcon} from "@radix-ui/react-icons";
import {useUser} from "core/auth/useUser";
import Link from "next/link";
import {useRouter} from "next/router";

function StudioNavigation() {
	const router = useRouter();
	const {pathname} = router;
	const {profile} = useUser();

	return (
		<Container
			className={"w-full flex justify-between border-b p-2"}
			css={{borderColor: "$border"}}
		>
			<Container className="flex gap-4">
				<Link href={"/studio"}>
					<a>
						<Button
							appearance={"link"}
							activeLink={pathname === "/studio"}
						>
							<HomeIcon className={"w-5 h-5"} />
							Dashboard
						</Button>
					</a>
				</Link>
				<Link href={"/studio/collections"}>
					<a>
						<Button
							appearance={"link"}
							activeLink={pathname.includes("/studio/collections")}
						>
							<StackIcon className={"w-5 h-5"} />
							Collections
						</Button>
					</a>
				</Link>
				<Link href={"/studio/nfts"}>
					<a>
						<Button
							appearance={"link"}
							activeLink={pathname.includes("/studio/nfts")}
						>
							<PhotographIcon className={"w-5 h-5"} />
							NFTs
						</Button>
					</a>
				</Link>
				<Link href={"/studio/portfolio"}>
					<a>
						<Button
							appearance={"link"}
							activeLink={pathname.includes("/studio/portfolio")}
						>
							<RectangleStack className={"w-5 h-5"} />
							Portfolio
						</Button>
					</a>
				</Link>
				<Link href={"/studio/wishlist"}>
					<a>
						<Button
							appearance={"link"}
							activeLink={pathname.includes("/studio/wishlist")}
						>
							<HeartIcon className={"w-5 h-5"} />
							Wishlist
						</Button>
					</a>
				</Link>
				<Link href={"/farm"}>
					<a>
						<Button
							appearance={"link"}
							activeLink={pathname.includes("/farm")}
						>
							<GiftIcon className={"w-5 h-5"} />
							Farm
						</Button>
					</a>
				</Link>
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
			<BoldLink
				css={{
					color: isActive ? "$accentText" : "$text",
					borderColor: "$accentText",
				}}
				className={`${isActive && "border-b-2"} py-2`}
			>
				{children}
			</BoldLink>
		</Link>
	);
}

export default StudioNavigation;
