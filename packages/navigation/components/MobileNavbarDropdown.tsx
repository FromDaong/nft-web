import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

import {
	DropdownContent,
	NavDropdownContainer,
	NavDropdownItem,
} from "./DropdownContainer";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {Container} from "@packages/shared/components/Container";
import {HamburgerMenuIcon} from "@radix-ui/react-icons";
import NavbarProfileAvatar from "./NavbarProfileAvatar";
import {ConnectButton} from "@rainbow-me/rainbowkit";

const ExploreDropdownLinks = [
	{
		label: "Sweetshop",
		link: "/sweetshop",
	},
	{
		label: "Farm",
		link: "/farm",
	},
	{
		label: "Buy BNB",
		link: "/swap",
	},
];

const MobileNavbarDropdown = (props: {isConnected: boolean}) => (
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Container>
				<Container
					className="border drop-shadow rounded-full grid place-items-center p-2"
					css={{
						backgroundColor: "$elementSurface",
						borderColor: "$subtleBorder",
					}}
				>
					<HamburgerMenuIcon
						width={16}
						height={16}
					/>
				</Container>
			</Container>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownContent>
				<NavDropdownContainer className="drop-shadow-2xl p-2">
					{ExploreDropdownLinks.map((link) => (
						<Link
							key={link.link}
							href={link.link}
						>
							<a>
								<NavDropdownItem>
									<Text>
										<ImportantText> {link.label}</ImportantText>
									</Text>
								</NavDropdownItem>
							</a>
						</Link>
					))}
					{!props.isConnected && (
						<ConnectButton
							label="Sign in"
							chainStatus="icon"
							showBalance={false}
						/>
					)}
				</NavDropdownContainer>
			</DropdownContent>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
);

export default MobileNavbarDropdown;
