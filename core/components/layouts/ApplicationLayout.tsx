import {Transition} from "@headlessui/react";
import {HomeIcon} from "@heroicons/react/outline";
import {useDisclosure} from "@packages/hooks";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {StackIcon} from "@radix-ui/react-icons";
import {ComponentBasicProps} from "core/TreatCore";
import {
	CompassIcon,
	GiftIcon,
	ImageIcon,
	SidebarClose,
	UserIcon,
} from "lucide-react";
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

export default function ApplicationLayout({
	children,
	thisRef,
}: ComponentBasicProps) {
	const {isOpen, onOpen, onClose} = useDisclosure();

	return (
		<Container
			css={{background: "$surface"}}
			className="flex h-full items-start overflow-y-auto"
			ref={thisRef}
		>
			<Sidebar
				navElements={navElements}
				isOpen={isOpen}
				onClose={onClose}
			/>
			<Container
				id="main"
				className="flex-1 relative min-h-full flex flex-col px-2 pb-32"
			>
				{children}
			</Container>
		</Container>
	);
}

function Sidebar({navElements, isOpen, onClose}) {
	return (
		<Transition
			show={isOpen}
			enterFrom="opacity-0 w-0"
			enterTo="w-64 opacity-100 h-full"
			leaveTo="w-0 opacity-0"
			className={"h-full fixed lg:sticky top-0 z-20 "}
		>
			<Container
				css={{
					backgroundColor: "$elementOnSurface",
				}}
				className="w-80 md:w-64 p-4 h-full  shadow-2xl lg:shadow-none"
			>
				<Container className="flex w-full justify-end">
					<Button
						onClick={onClose}
						appearance={"subtle"}
					>
						<SidebarClose className="w-5 h-5" />
					</Button>
				</Container>
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
											background: "$surfaceOnSurface",
										},
									}}
									className="flex items-center gap-4 p-2 px-4 rounded-xl transition-all duration-200"
								>
									<Text>{item.icon}</Text>
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
		</Transition>
	);
}
