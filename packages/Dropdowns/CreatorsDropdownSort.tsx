import {DropdownMenuItem} from "@packages/Dropdowns";
import {Button} from "@packages/shared/components/Button";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {styled} from "@styles/theme";

const DropDownContent = styled(DropdownMenu.Content, {
	backgroundColor: "$surface",
});

const CreatorsDropdownSort = ({setSort, sort, label}) => (
	<DropdownMenu.Root>
		<DropdownMenu.Trigger className="flex">
			<Button appearance={"surface"}>Sort: {label}</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropDownContent className="z-30 p-3 transition-all duration-150 shadow-lg gap-y-3 rounded-xl">
				<DropdownMenuItem
					onClick={() => setSort(1)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 1 && "$accentText",
						borderRadius: "16px",
						color: Number(sort) === 1 && "$surface",
						"&hover": {
							color: Number(sort) === 1 && "$textContrast !important",
						},
					}}
				>
					<ImportantText>A - Z</ImportantText>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(2)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 2 && "$accentText",
						borderRadius: "26px",
						color: Number(sort) === 2 && "$surface",
						"&hover": {
							color: Number(sort) === 2 && "$textContrast !important",
						},
					}}
				>
					<ImportantText>Z - A</ImportantText>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(3)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 3 && "$accentText",
						borderRadius: "36px",
						color: Number(sort) === 3 && "$surface",
						"&hover": {
							color: Number(sort) === 3 && "$textContrast !important",
						},
					}}
				>
					<ImportantText>Most followers first</ImportantText>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(4)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 4 && "$accentText",
						borderRadius: "46px",
						color: Number(sort) === 4 && "$surface",
						"&hover": {
							color: Number(sort) === 4 && "$textContrast !important",
						},
					}}
				>
					<ImportantText>Least followers first</ImportantText>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(5)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 5 && "$accentText",
						borderRadius: "16px",
						color: Number(sort) === 5 && "$surface",
						"&hover": {
							color: Number(sort) === 5 && "$textContrast !important",
						},
					}}
				>
					<ImportantText>Most NFTs first</ImportantText>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(6)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 6 && "$accentText",
						borderRadius: "16px",
						color: Number(sort) === 6 && "$surface",
						"&hover": {
							color: Number(sort) === 6 && "$textContrast !important",
						},
					}}
				>
					<ImportantText>Least NFTs first</ImportantText>
				</DropdownMenuItem>
			</DropDownContent>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
);

export default CreatorsDropdownSort;
