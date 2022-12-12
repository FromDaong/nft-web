import * as ToggleItem from "@radix-ui/react-toggle";
import {styled} from "@styles/theme";
import {Transition} from "@headlessui/react";
import {ImportantText, Text} from "../Typography/Text";

const ThemedToggle = styled(ToggleItem.Root, {
	border: "1px solid $border",
	padding: "4px 12px",
	borderRadius: "9999px",
	backgroundColor: "$elementSurface",
	boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.02)",
});

const SelectableTag = (props: {
	toggle: any;
	selected: Array<string>;
	value: string;
	label: string;
}) => {
	console.log({props});
	const isSelected =
		props.selected.filter((item) => item === props.value).length > 0;
	return (
		<ThemedToggle
			className="Toggle"
			aria-label="Toggle option"
			onClick={() => props.toggle(props.value)}
			css={{
				backgroundColor: isSelected
					? "$textContrast !important"
					: "$elementSurface !important",
			}}
		>
			<Text
				css={{
					color: isSelected
						? "$elementSurface !important"
						: "$textContrast !important",
				}}
			>
				<ImportantText>{props.label}</ImportantText>
			</Text>
		</ThemedToggle>
	);
};

export default SelectableTag;
