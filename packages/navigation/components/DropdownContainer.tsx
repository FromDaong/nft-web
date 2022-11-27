import { Content, Item } from "@radix-ui/react-dropdown-menu";
import { styled } from "@styles/theme";

export const DropdownContainer = styled("div", {
  width: "320px",
  backgroundColor: "$surfaceOnSurface",
  border: "1px solid $border",
  borderRadius: "16px",
  padding: "8px",
  zIndex: "100",
});

export const NavDropdownContainer = styled("div", {
  width: "fit-content",
  background: "$surfaceOnSurface",
  border: "1px solid $border",
  borderRadius: "8px",
  zIndex: "100",
  padding: "4px",
});

export const NavDropdownItem = styled(Item, {
  minWidth: "200px",
  borderRadius: "15px",
  fontWeight: "600",

  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "$elementOnSurface",
    cursor: "pointer",
    borderRadius: "15px",
  },
});

export const DropdownContent = styled(Content, {
  zIndex: "100",
});
