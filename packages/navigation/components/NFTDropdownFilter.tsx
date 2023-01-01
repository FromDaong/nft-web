import {DropdownMenuItem} from "@packages/Dropdowns";
import {Button} from "@packages/shared/components/Button";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const NFTDropdownSort = ({setSort}) => (
	<DropdownMenu.Root>
		<DropdownMenu.Trigger className="flex">
			<Button>Sort</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content className="z-30 p-3 transition-all duration-150 bg-white shadow-xl gap-y-3 rounded-xl">
				<DropdownMenuItem
					onClick={() => setSort(1)}
					className="flex gap-2 px-4 py-2"
				>
					<Text>
						<ImportantText>Lowest price first</ImportantText>
					</Text>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(2)}
					className="flex gap-2 px-4 py-2"
				>
					<Text>
						<ImportantText>Highest price first</ImportantText>
					</Text>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(3)}
					className="flex gap-2 px-4 py-2"
				>
					<Text>
						<ImportantText>Date created</ImportantText>
					</Text>
				</DropdownMenuItem>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
);

export default NFTDropdownSort;
