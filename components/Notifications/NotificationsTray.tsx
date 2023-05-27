import {
	DropdownContainer,
	DropdownContent,
	NavDropdownItem,
} from "@packages/navigation/components/DropdownContainer";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	BoldLink,
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {BellRingIcon} from "lucide-react";

export default function NotificationsTray() {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Container>
					<Button
						css={{
							padding: "0.5rem",
						}}
						appearance={"surface"}
					>
						<BellRingIcon className={"w-5 h-5"} />
					</Button>
				</Container>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownContent>
					<DropdownContainer className="shadow-2xl">
						<DropdownMenu.DropdownMenuGroup className="flex flex-col gap-2 px-4 pt-2 my-2">
							<Heading size={"xss"}>Notifications</Heading>
						</DropdownMenu.DropdownMenuGroup>
						<DropdownMenu.DropdownMenuGroup className="flex flex-col gap-2 px-2 my-2">
							<a href={`/`}>
								<NavDropdownItem className="flex items-center justify-between p-2 rounded-xl hover:cursor-pointer w-[320px]">
									<BoldLink className="flex gap-4">
										<Container className="relative w-8 h-full p-4 mt-1 border rounded"></Container>
										<Container className="flex flex-col">
											<p>
												<SmallText>
													<ImportantText>Mistress of the East</ImportantText>
												</SmallText>{" "}
												<SmallText>sold for</SmallText>{" "}
												<SmallText>
													<ImportantText>0.001 BNB</ImportantText>
												</SmallText>
											</p>
											<SmallText>3 hours ago</SmallText>
										</Container>
									</BoldLink>
								</NavDropdownItem>
							</a>
						</DropdownMenu.DropdownMenuGroup>
					</DropdownContainer>
				</DropdownContent>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
