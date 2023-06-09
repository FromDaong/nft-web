import {HomeIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {StackIcon} from "@radix-ui/react-icons";
import {styled} from "@styles/theme";
import {ComponentBasicProps} from "core/TreatCore";
import {CompassIcon, GiftIcon, ImageIcon, UserIcon} from "lucide-react";
import Link from "next/link";

const navElements = [
	{
		name: "Home",
		href: "/",
		icon: <HomeIcon className="w-5 h-5" />,
	},
	{
		name: "Explore",
		href: "/explore",
		icon: <CompassIcon className="w-5 h-5" />,
	},
	{
		name: "Collections",
		href: "/create",
		icon: <StackIcon className="w-5 h-5" />,
	},
	{
		name: "Farms",
		href: "/studio/farm",
		icon: <GiftIcon className="w-5 h-5" />,
	},
	{
		name: "My NFTs",
		href: "/studio/nfts",
		icon: <ImageIcon className="w-5 h-5" />,
	},
	{
		name: "My Profile",
		href: "/studio/profile",
		icon: <UserIcon className="w-5 h-5" />,
	},
];

export default function ApplicationLayout({children}: ComponentBasicProps) {
	return (
		<Container
			css={{background: "$surface"}}
			className="flex h-full items-start"
		>
			<Container className="w-96 p-8 sticky top-0">
				<Container className="flex flex-col gap-2">
					{navElements.map((item) => (
						<Link
							href={item.href}
							key={item.name}
						>
							<a>
								<Container
									css={{
										"&:hover": {
											background: "$accentBg",
										},
									}}
									className="flex items-center gap-4 p-2 px-4 rounded-xl transition-all duration-200"
								>
									<Text css={{color: "$accentText"}}>{item.icon}</Text>
									<Container>
										<Text>
											<ImportantText>{item.name}</ImportantText>
										</Text>
									</Container>
								</Container>
							</a>
						</Link>
					))}
				</Container>
			</Container>
			<Container className="flex-1">{children}</Container>
		</Container>
	);
}
