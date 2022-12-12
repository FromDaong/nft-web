import * as ToggleItem from "@radix-ui/react-toggle";
import {styled} from "@styles/theme";
import {ReactNode} from "react";

const ThemedToggle = styled(ToggleItem.Root, {
	border: "1px solid $border",
	padding: "4px 12px",
	borderRadius: "9999px",
	backgroundColor: "$elementSurface",
	boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.02)",
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
