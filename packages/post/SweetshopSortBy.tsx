import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
	SmallText,
	Text,
} from "@packages/shared/components/Typography/Text";
import * as Select from "@radix-ui/react-select";
import {styled} from "@styles/theme";

const SelectContent = styled(Select.Content, {
	backgroundColor: "$elementSurface",
	borderRadius: "16px",
	zIndex: 100,
});

export default function SweetshopSortBy() {
	return (
		<Select.Root>
			<Select.Trigger>
				<Button appearance={"surface"}>
					<Select.Value placeholder="Sort by" />
					<Select.Icon />
				</Button>
			</Select.Trigger>

			<Select.Portal>
				<SelectContent className="p-2 shadow">
					<Select.ScrollUpButton />
					<Select.Viewport>
						<Select.Item
							className="px-4 py-2"
							value="latest-first"
						>
							<Select.ItemText>
								<Text>
									<ImportantText>Latest first</ImportantText>
								</Text>
							</Select.ItemText>
							<Select.ItemIndicator />
						</Select.Item>
						<Select.Item
							className="px-4 py-2"
							value="oldest-first"
						>
							<Select.ItemText>
								<ImportantText>Oldest first</ImportantText>
							</Select.ItemText>
							<Select.ItemIndicator />
						</Select.Item>
						<Select.Item
							className="px-4 py-2"
							value="cheapest-first"
						>
							<Select.ItemText>
								<ImportantText>Price: Lowest first</ImportantText>
							</Select.ItemText>
							<Select.ItemIndicator />
						</Select.Item>
						<Select.Item
							className="px-4 py-2"
							value="expensive-first"
						>
							<Select.ItemText>
								<ImportantText>Price: Highest first</ImportantText>
							</Select.ItemText>
							<Select.ItemIndicator />
						</Select.Item>
					</Select.Viewport>
					<Select.ScrollDownButton />
				</SelectContent>
			</Select.Portal>
		</Select.Root>
	);
}
