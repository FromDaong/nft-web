import * as Select from "@radix-ui/react-select";

export default function SweetshopSortBy() {
	return (
		<Select.Root>
			<Select.Trigger>
				<Select.Value placeholder="Sort by" />
				<Select.Icon />
			</Select.Trigger>

			<Select.Portal>
				<Select.Content>
					<Select.ScrollUpButton />
					<Select.Viewport>
						<Select.Group>
							<Select.Label>Sort by date</Select.Label>
							<Select.Item>
								<Select.ItemText />
								<Select.ItemIndicator />
							</Select.Item>
						</Select.Group>

						<Select.Group>
							<Select.Label>Sort by price</Select.Label>
							<Select.Item>
								<Select.ItemText />
								<Select.ItemIndicator />
							</Select.Item>
						</Select.Group>

						<Select.Separator />
					</Select.Viewport>
					<Select.ScrollDownButton />
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}
