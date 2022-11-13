import { createStitches } from "@stitches/react";

export const { createTheme } = createStitches({
  utils: {
    marginY: (value) => ({
      marginTop: value,
      marginBottom: value,
    }),
    marginX: (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
    paddingY: (value) => ({
      marginTop: value,
      marginBottom: value,
    }),
    paddingX: (value) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    maxW: (value) => {
      let w: number;

      switch (value) {
        case "sm":
          w = 640;
          break;
        case "md":
          w = 768;
          break;
        case "lg":
          w = 1024;
          break;
        case "xl":
          w = 1280;
          break;
        case "2xl":
          w = 1960;
          break;
        default:
          break;
      }
      return {
        maxWidth: `${w ? w + "px" : "100%"}`,
      };
    },
  },
  media: {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1960px)",
  },
});

export const calculateColorHSL = () => {
  return {};
};

//TODO: Theme colors OG pink = https://www.happyhues.co/palettes/7

export const darkTheme = createTheme("dark", {
  colors: {
    gray500: "hsl(206,10%,76%)",
    blue500: "hsl(206,100%,50%)",
    purple500: "hsl(252,78%,60%)",
    green500: "hsl(148,60%,60%)",
    red500: "hsl(352,100%,62%)",
    primary: "",
    secondary: "",
    accent: "",
    warning: "",
    error: "",
    success: "",
    bg_primary: "",
    bg_error: "",
    bg_secondary: "",
    bg_accent: "",
    bg_success: "",
    bg_warning: "",
    shadow: "",
    input_bg: "",
    input_border: "",
    input_border_focus: "",
    overlay: "",
  },
  space: {
    1: "5px",
    2: "10px",
    3: "15px",
  },
  fontSizes: {
    1: "12px",
    2: "13px",
    3: "15px",
  },
  fonts: {
    untitled: "Untitled Sans, apple-system, sans-serif",
    mono: "Söhne Mono, menlo, monospace",
  },
  fontWeights: {},
  lineHeights: {},
  letterSpacings: {},
  sizes: {},
  borderWidths: {},
  borderStyles: {},
  radii: {},
  shadows: {},
  zIndices: {},
  transitions: {},
});

export const ogPinkTheme = createTheme("pink", {
  colors: {
    muted: "",
    default: "",
    surface: "",
    primary: "",
    accent: "",
    warning: "",
    error: "",
    brand: "",
    success: "",
    on_accent: "",
  },
  space: {
    1: "5px",
    2: "10px",
    3: "15px",
  },
  fontSizes: {
    1: "12px",
    2: "13px",
    3: "15px",
  },
  fonts: {
    untitled: "Untitled Sans, apple-system, sans-serif",
    mono: "Söhne Mono, menlo, monospace",
  },
  fontWeights: {},
  lineHeights: {},
  letterSpacings: {},
  sizes: {},
  borderWidths: {},
  borderStyles: {},
  radii: {},
  shadows: {},
  zIndices: {},
  transitions: {},
});

export const lightTheme = createTheme("light", {
  colors: {
    gray500: "hsl(206,10%,76%)",
    blue500: "hsl(206,100%,50%)",
    purple500: "hsl(252,78%,60%)",
    green500: "hsl(148,60%,60%)",
    red500: "hsl(352,100%,62%)",
  },
  space: {
    xs: "5px",
    sm: "10px",
    md: "15px",
    lg: "21px",
    xl: "28px",
  },
  fontSizes: {
    xs: "12px",
    sm: "13px",
    base: "17px",
    lg: "21px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "96px",
  },
  fonts: {
    untitled: "Untitled Sans, apple-system, sans-serif",
    mono: "Söhne Mono, menlo, monospace",
  },
  fontWeights: {
    heading: "700",
    button: "500",
    text: "400",
    thin: "300",
  },
  lineHeights: {},
  letterSpacings: {},
  sizes: {},
  borderWidths: {},
  borderStyles: {},
  radii: {
    base: "30px",
    tight: "8px",
    full: "50%",
  },
  shadows: {},
  zIndices: {
    base: 1,
    navbar: 10,
    overlay: 20,
    modal: 30,
    notification: 40,
    under: -1,
  },
});

// TODO: Favicon size must drop
