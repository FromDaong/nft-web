import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import {CaretDownIcon} from "@radix-ui/react-icons";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {styled} from "@styles/theme";
import * as DarkLogo from "../../../public/brand/logo_white.svg";
import Image from "next/future/image";
import {Container} from "@packages/shared/components/Container";

const NavMenuContainer = styled(NavigationMenu.Content, {
	backgroundColor: "$surfaceOnSurface",
});

const NavbarMenu = () => {
	return (
		<NavigationMenu.Root className="relative ">
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>
						<Text css={{color: "$textContrast"}}>
							<ImportantText className="flex items-center">
								Explore <CaretDownIcon aria-hidden />
							</ImportantText>
						</Text>
					</NavigationMenu.Trigger>
					<NavMenuContainer className="rounded-2xl transition-all duration-200">
						<ul className="one m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
							<li className="row-span-3 grid">
								<NavigationMenu.Link asChild>
									<a
										className="focus:shadow-orange-500 from-pink-500 to-pink-700 flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-gradient-to-b p-[25px] no-underline outline-none focus:shadow-[0_0_0_2px]"
										href="/"
									>
										<Container className={"relative mb-4"}>
											<Image
												src={DarkLogo}
												alt="Logo"
												height={32}
												width={32}
											/>
										</Container>
										<Heading
											size={"xss"}
											css={{color: "$white"}}
										>
											TreatDAO
										</Heading>
										<Text
											className="mt-2"
											css={{color: "$white", fontSize: "1rem"}}
										>
											Welcome to our renewed Adult NFT Marketplace
										</Text>
									</a>
								</NavigationMenu.Link>
							</li>

							<ListItem
								href="/sweetshop"
								title="Sweetshop"
							>
								The brand new sweetshop features all TreatDAO marketplaces in
								one place!
							</ListItem>
							{false && (
								<ListItem
									href="/collection"
									title="Collections"
								>
									Shop NFTs curated by verified Treat creators.
								</ListItem>
							)}
							<ListItem
								href="/farm"
								title="Farm"
							>
								Stake $TREAT and redeem exclusive rewards.
							</ListItem>
						</ul>
					</NavMenuContainer>
				</NavigationMenu.Item>

				<NavigationMenu.Indicator className="data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]">
					<div className="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] " />
				</NavigationMenu.Indicator>
			</NavigationMenu.List>

			<div className="absolute top-full left-0 flex w-fit shadow-2xl justify-center">
				<NavigationMenu.Viewport className="data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-xl transition-[width,_height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]" />
			</div>
		</NavigationMenu.Root>
	);
};

const NavLink = styled(NavigationMenu.Link, {
	"&:hover": {
		backgroundColor: "$elementOnSurface",
	},
});

const ListItem = ({children, href, title}) => (
	<li>
		<NavLink asChild>
			<a
				className={classNames(
					"block select-none rounded-[6px] p-3 leading-none no-underline outline-none transition-colors"
				)}
				href={href}
			>
				<div className="text-violet12 mb-[5px] font-medium leading-[1.2]">
					<Heading size={"xss"}>{title}</Heading>
				</div>
				<p className="text-mauve11 leading-[1.4]">{children}</p>
			</a>
		</NavLink>
	</li>
);

export default NavbarMenu;
