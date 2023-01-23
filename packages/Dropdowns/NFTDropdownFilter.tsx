import {DropdownMenuItem} from "@packages/Dropdowns";
import {Button} from "@packages/shared/components/Button";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {styled} from "@styles/theme";

const DropDownContent = styled(DropdownMenu.Content, {
	backgroundColor: "$surface",
});

const NFTDropdownSort = ({setSort, sort, label}) => (
	<DropdownMenu.Root>
		<DropdownMenu.Trigger className="flex">
			<Button appearance={"surface"}>Sort: {label}</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal className="transition-all duration-150">
			<DropDownContent
				className="z-30 p-3 border shadow-lg gap-y-3 rounded-xl"
				css={{border: "$subtleBorder"}}
			>
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
					<ImportantText>Lowest price first</ImportantText>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(2)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 2 && "$accentText",
						borderRadius: "16px",
						color: Number(sort) === 2 && "$surface",
						"&hover": {
							color: Number(sort) === 2 && "$textContrast !important",
						},
					}}
				>
					<ImportantText>Highest price first</ImportantText>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setSort(3)}
					className="flex gap-2 px-4 py-2"
					css={{
						backgroundColor: Number(sort) === 3 && "$accentText",
						borderRadius: "16px",
						color: Number(sort) === 3 && "$surface",
						"&hover": {
							color: Number(sort) === 3 && "$textContrast !important",
						},
					}}
				>
					<ImportantText>Newest first</ImportantText>
				</DropdownMenuItem>
			</DropDownContent>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
);

export default NFTDropdownSort;
