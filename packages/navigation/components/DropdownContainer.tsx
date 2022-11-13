import { Content, Item } from "@radix-ui/react-dropdown-menu";
import { styled } from "@styles/theme";

export const DropdownContainer = styled("div", {
  width: "320px",
  background: "#FFFFFF",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  boxShadow: "0px 4px 23px rgba(0, 0, 0, 0.10)",
  borderRadius: "30px",
  padding: "12px",
  zIndex: "100",
});

export const NavDropdownContainer = styled("div", {
  width: "fit-content",
  background: "#FFFFFF",
  border: "1px solid rgba(0, 0, 0, 0.07)",
  boxShadow: "0px 4px 23px rgba(0, 0, 0, 0.05)",
  borderRadius: "30px",
  zIndex: "100",
  padding: "12px",
});

export const NavDropdownItem = styled(Item, {
  padding: "12px",
  minWidth: "200px",
  borderRadius: "12px",
  fontWeight: "500",
});

export const DropdownContent = styled(Content, {
  zIndex: "100",
});
