import {ChevronDownIcon} from "@heroicons/react/outline";
import {DropdownContent} from "@packages/navigation/components/DropdownContainer";
import {Button} from "@packages/shared/components/Button";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {styled} from "@styles/theme";

export const DropdownMenuItem = styled(DropdownMenu.Item, {
	padding: "8px 16px",
	"&:hover": {
		backgroundColor: "$elementOnSurface",
		cursor: "pointer",
		borderRadius: "15px",
		color: "$textContrast !important",
	},
});

export const ProfileDropdown = (props: {username: string; address: string}) => {
	return (
		<>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<Button
						css={{backgroundColor: "$surface", borderColor: "$subtleBorder"}}
						outlined
						className="flex items-center border"
					>
						{props.address.slice(0, 4) +
							"..." +
							props.address.slice(props.address.length - 4)}
						<ChevronDownIcon className="w-4 h-4" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownContent
						className="drop-shadow-2xl"
						css={{
							backgroundColor: "$elementSurface",
							padding: "4px",
							borderRadius: "21px",
							minWidth: "180px",
							marginTop: "6px",
						}}
					>
						<DropdownMenu.Group>
							{false && (
								<DropdownMenuItem>
									<ImportantText>Send a tip</ImportantText>
								</DropdownMenuItem>
							)}
							<DropdownMenuItem>
								<ImportantText>Share</ImportantText>
							</DropdownMenuItem>
						</DropdownMenu.Group>
						<DropdownMenu.Group>
							<DropdownMenuItem>
								<ImportantText css={{color: "$errorText"}}>Block</ImportantText>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<ImportantText css={{color: "$errorText"}}>
									Report
								</ImportantText>
							</DropdownMenuItem>
						</DropdownMenu.Group>
					</DropdownContent>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</>
	);
};
