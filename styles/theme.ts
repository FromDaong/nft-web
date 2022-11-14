import {
  mauveA,
  purple,
  red,
  teal,
  pink,
  sky,
  mint,
  amber,
  crimson,
  crimsonDark,
  mauveDark,
  purpleDark,
  redDark,
  tealDark,
  pinkDark,
} from "@radix-ui/colors";

import { createStitches } from "@stitches/react";

export const { createTheme, styled, getCssText, globalCss } = createStitches({
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

const baseColors = {
  // White foreground text at step 9 bg
  ...teal, // Success
  ...purple,
  ...mauveA,
  ...red, // Error
  ...pink,
  ...mint, // Success
  ...amber, // Warning
  ...sky, // Info
  ...mauveDark,
  ...purpleDark,
  ...redDark,
  ...tealDark,
  ...pinkDark,
  ...crimson,
  ...crimsonDark,
  white: "#fff",

  // Black foreground text at step 9 bg
};

//TODO: Theme colors OG pink = https://www.happyhues.co/palettes/7

export const darkTheme = createTheme("dark", {
  colors: {
    ...baseColors,
    accentBase: "$purple1",
    accentBgSubtle: "$purple2",
    accentBg: "$purple3",
    accentBgHover: "$purple4",
    accentBgActive: "$purple5",
    accentLine: "$purple6",
    accentBorder: "$purple7",
    accentBorderHover: "$purple8",
    accentSolid: "$purple9",
    accentSolidHover: "$purple10",
    accentText: "$purple11",
    accentTextContrast: "$purple12",

    successBase: "$teal1",
    successBgSubtle: "$teal2",
    successBg: "$teal3",
    successBgHover: "$teal4",
    successBgActive: "$teal5",
    successLine: "$teal6",
    successBorder: "$teal7",
    successBorderHover: "$teal8",
    successSolid: "$teal9",
    successSolidHover: "$teal10",
    successText: "$teal11",
    successTextContrast: "$teal12",

    bodyBackground: "$mauveA12",
    text: "$mauveA2",
    heading: "$mauveA1",
    mutedText: "$mauveA5",
    divider: "$teal6",
    hiContrast: "$slate1",
    loContrast: "white",
    canvas: "hsl(0 0% 93%)",
    panel: "white",
    transparentPanel: "hsl(0 0% 0% / 97%)",
    shadowLight: "hsl(206 22% 7% / 35%)",
    shadowDark: "hsl(206 22% 7% / 20%)",
  },
  space: {
    1: "5px",
    2: "10px",
    3: "15px",
    4: "24px",
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
    ...baseColors,
    accentBase: "$purple1",
    accentBgSubtle: "$purple2",
    accentBg: "$purple3",
    accentBgHover: "$purple4",
    accentBgActive: "$purple5",
    accentLine: "$purple6",
    accentBorder: "$purple7",
    accentBorderHover: "$purple8",
    accentSolid: "$purple9",
    accentSolidHover: "$purple10",
    accentText: "$purple11",
    accentTextContrast: "$purple12",

    successBase: "$teal1",
    successBgSubtle: "$teal2",
    successBg: "$teal3",
    successBgHover: "$teal4",
    successBgActive: "$teal5",
    successLine: "$teal6",
    successBorder: "$teal7",
    successBorderHover: "$teal8",
    successSolid: "$teal9",
    successSolidHover: "$teal10",
    successText: "$teal11",
    successTextContrast: "$teal12",

    bodyBackground: "white",
    text: "$mauveA11",
    heading: "$mauveA12",
    mutedText: "$mauveA7",
    divider: "$teal6",
    hiContrast: "$slate12",
    loContrast: "white",
    canvas: "hsl(0 0% 93%)",
    panel: "white",
    transparentPanel: "hsl(0 0% 0% / 97%)",
    shadowLight: "hsl(206 22% 7% / 35%)",
    shadowDark: "hsl(206 22% 7% / 20%)",
  },
  space: {
    1: "5px",
    2: "10px",
    3: "15px",
    4: "20px",
    5: "25px",
    6: "35px",
    7: "45px",
    8: "65px",
    9: "80px",
  },
  fontSizes: {
    1: "12px",
    2: "13px",
    3: "15px",
    4: "17px",
    5: "19px",
    6: "21px",
    7: "27px",
    8: "35px",
    9: "59px",
  },
  fonts: {
    untitled: "Untitled Sans, apple-system, sans-serif",
    mono: "Söhne Mono, menlo, monospace",
  },
  fontWeights: {},
  lineHeights: {},
  letterSpacings: {},
  media: {
    bp1: "(min-width: 520px)",
    bp2: "(min-width: 900px)",
    bp3: "(min-width: 1200px)",
    bp4: "(min-width: 1800px)",
    motion: "(prefers-reduced-motion)",
    hover: "(any-hover: hover)",
    dark: "(prefers-color-scheme: dark)",
    light: "(prefers-color-scheme: light)",
  },
  borderWidths: {},
  borderStyles: {},
  radii: {
    1: "4px",
    2: "6px",
    3: "8px",
    4: "12px",
    round: "50%",
    pill: "9999px",
  },
  shadows: {},
  zIndices: {},
  transitions: {},
});

export const lightTheme = createTheme("light", {
  colors: {
    ...baseColors,
    accentBase: "$purple1",
    accentBgSubtle: "$purple2",
    accentBg: "$purple3",
    accentBgHover: "$purple4",
    accentBgActive: "$purple5",
    accentLine: "$purple6",
    accentBorder: "$purple7",
    accentBorderHover: "$purple8",
    accentSolid: "$purple9",
    accentSolidHover: "$purple10",
    accentText: "$purple11",
    accentTextContrast: "$purple12",

    successBase: "$teal1",
    successBgSubtle: "$teal2",
    successBg: "$teal3",
    successBgHover: "$teal4",
    successBgActive: "$teal5",
    successLine: "$teal6",
    successBorder: "$teal7",
    successBorderHover: "$teal8",
    successSolid: "$teal9",
    successSolidHover: "$teal10",
    successText: "$teal11",
    successTextContrast: "$teal12",

    text: "$mauveA11",
    textContrast: "$mauveA12",
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
