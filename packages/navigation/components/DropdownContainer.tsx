import { Content, Item } from "@radix-ui/react-dropdown-menu";
import { styled } from "@styles/theme";

export const DropdownContainer = styled("div", {
  width: "320px",
  backgroundColor: "$surface",
  border: "1px solid $border",
  borderRadius: "30px",
  padding: "12px",
  zIndex: "100",
});

export const NavDropdownContainer = styled("div", {
  width: "fit-content",
  background: "$surface",
  border: "1px solid $border",
  borderRadius: "15px",
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
