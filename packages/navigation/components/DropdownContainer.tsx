import { Content, Item } from "@radix-ui/react-dropdown-menu";
import { styled } from "@styles/theme";

export const DropdownContainer = styled("div", {
  width: "320px",
  backgroundColor: "$surfaceOnSurface",
  border: "1px solid $border",
  borderRadius: "30px",
  padding: "12px",
  zIndex: "100",
});

export const NavDropdownContainer = styled("div", {
  width: "fit-content",
  background: "$surfaceOnSurface",
  border: "1px solid $border",
  borderRadius: "30px",
  zIndex: "100",
  padding: "12px",
});

export const NavDropdownItem = styled(Item, {
  padding: "12px",
  minWidth: "200px",
  borderRadius: "12px",
  fontWeight: "600",
});

export const DropdownContent = styled(Content, {
  zIndex: "100",
});
