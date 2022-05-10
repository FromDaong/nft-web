import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    secondary: {
      50: "#F1EBFA",
      100: "#D9C7F0",
      200: "#C1A3E6",
      300: "#A87EDC",
      400: "#905AD3",
      500: "#7736C9",
      600: "#602BA1",
      700: "#482178",
      800: "#301650",
      900: "#180B28",
    },
    primary: {
      50: "#FCE8EF",
      100: "#F8BFD4",
      200: "#F396B8",
      300: "#EE6D9C",
      400: "#E94380",
      500: "#E94380",
      600: "#B71550",
      700: "#89103C",
      800: "#5B0B28",
      900: "#2E0514",
    },
  },
});

export default theme;
