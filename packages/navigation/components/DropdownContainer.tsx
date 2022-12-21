import {Content, Item} from "@radix-ui/react-dropdown-menu";
import {styled} from "@styles/theme";

export const DropdownContainer = styled("div", {
	width: "max-content",
	backgroundColor: "$elementSurface",
	border: "1px solid $border",
	borderRadius: "16px",
	padding: "8px",
	zIndex: "100",
	minWidth: "280px",
});

export const NavDropdownContainer = styled("div", {
	width: "fit-content",
	background: "$elementSurface",

	borderRadius: "8px",
	zIndex: "100",
	padding: "4px",
	minWidth: "180px",
});

export const NavDropdownItem = styled(Item, {
	minWidth: "120px",
	borderRadius: "15px",
	fontWeight: "600",

	padding: "8px 12px",
	"&:hover": {
		backgroundColor: "$elementOnSurface",
		cursor: "pointer",
		borderRadius: "15px",
	},
});

export const DropdownContent = styled(Content, {
	zIndex: "100",
});
