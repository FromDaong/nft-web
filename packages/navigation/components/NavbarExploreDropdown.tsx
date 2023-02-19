import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {ChevronDownIcon} from "@heroicons/react/solid";
import Link from "next/link";

import {
	DropdownContent,
	NavDropdownContainer,
	NavDropdownItem,
} from "./DropdownContainer";
import {
	BoldLink,
	ImportantText,
	Text,
} from "@packages/shared/components/Typography/Text";

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
		label: "Buy Crypto",
		link: "/dex/ramp",
	},
];

const NavbarExploreDropdown = () => (
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<BoldLink className="flex items-center gap-1">
				Explore <ChevronDownIcon className="w-5 h-5" />
			</BoldLink>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal className="p-2 max-w-[180px]">
			<DropdownContent>
				<NavDropdownContainer
					className="p-4 drop-shadow-2xl"
					css={{borderRadius: "20px"}}
				>
					{ExploreDropdownLinks.map((link) => (
						(<Link
							key={link.link}
							href={link.link}
						>

                            <NavDropdownItem>
                                <Text className="py-3">
                                    <ImportantText> {link.label}</ImportantText>
                                </Text>
                            </NavDropdownItem>

                        </Link>)
					))}
				</NavDropdownContainer>
			</DropdownContent>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
);

export default NavbarExploreDropdown;
