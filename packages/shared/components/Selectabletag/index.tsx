import * as ToggleItem from "@radix-ui/react-toggle";
import {styled} from "@styles/theme";
import {ReactNode} from "react";

const ThemedToggle = styled(ToggleItem.Root, {
	border: "2px solid $border",
	padding: "4px 12px",
	borderRadius: "9999px",
	backgroundColor: "$elementOnSurface",
});

const SelectableTag = (props: {children: ReactNode}) => (
	<ThemedToggle
		className="Toggle"
		aria-label="Toggle option"
	>
		{props.children}
	</ThemedToggle>
);

export default SelectableTag;
