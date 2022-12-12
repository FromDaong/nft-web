import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Text";
import * as Select from "@radix-ui/react-select";
import {styled} from "@styles/theme";

const SelectContent = styled(Select.Content, {
	backgroundColor: "$elementSurface",
	borderRadius: "16px",
	zIndex: 100,
});

export default function FilterSweetshopDropdown({setFilters, filters}) {
	return (
		<Select.Root>
			<Select.Trigger>
				<Button appearance={"surface"}>
					<Select.Value placeholder="Filters" />
					<Select.Icon />
				</Button>
			</Select.Trigger>

			<Select.Portal>
				<SelectContent className="shadow p-2">
					<Select.ScrollUpButton />
					<Select.Viewport>
						<Select.Item
							className="px-4 py-2"
							value="latest-first"
						>
							<Select.ItemText>
								<Text>Free</Text>
							</Select.ItemText>
							<Select.ItemIndicator />
						</Select.Item>
						<Select.Item
							className="px-4 py-2"
							value="latest-first"
						>
							<Select.ItemText>
								<Text>Sold out</Text>
							</Select.ItemText>
							<Select.ItemIndicator />
						</Select.Item>
						<Select.Item
							className="px-4 py-2"
							value="oldest-first"
						>
							<Select.ItemText>
								<Text>Oldest first</Text>
							</Select.ItemText>
							<Select.ItemIndicator />
						</Select.Item>
						<Select.Item
							className="px-4 py-2"
							value="cheapest-first"
						>
							<Select.ItemText>
								<Text>Price: Lowest first</Text>
							</Select.ItemText>
							<Select.ItemIndicator />
						</Select.Item>
						<Select.Item
							className="px-4 py-2"
							value="expensive-first"
						>
							<Select.ItemText>
								<Text>Price: Highest first</Text>
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
