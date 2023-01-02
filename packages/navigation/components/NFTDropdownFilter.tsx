import {DropdownMenuItem} from "@packages/Dropdowns";
import {Button} from "@packages/shared/components/Button";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const NFTDropdownSort = ({setSort, sort}) => (
	<DropdownMenu.Root>
		<DropdownMenu.Trigger className="flex">
			<Button>Sort</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content className="z-30 p-3 transition-all duration-150 bg-white shadow-xl gap-y-3 rounded-xl">
				<DropdownMenuItem
					onClick={() => setSort(1)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 1 && "$accentText",
						borderRadius: "16px",
					}}
				>
					<Text
						css={{
							color: Number(sort) === 1 && "$surface",
							"&hover": {
								color: "$textContrast",
							},
						}}
					>
						<ImportantText>Lowest price first</ImportantText>
					</Text>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(2)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 2 && "$accentText",
						borderRadius: "16px",
					}}
				>
					<Text
						css={{
							color: Number(sort) === 2 && "$surface ",
							"&hover": {
								color: "$textContrast",
							},
						}}
					>
						<ImportantText>Highest price first</ImportantText>
					</Text>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(3)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 3 && "$accentText",
						borderRadius: "16px",
					}}
				>
					<Text
						css={{
							color: Number(sort) === 3 && "$surface ",
							"&hover": {
								color: "$textContrast",
							},
						}}
					>
						<ImportantText>Newest first</ImportantText>
					</Text>
				</DropdownMenuItem>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
);

export default NFTDropdownSort;
