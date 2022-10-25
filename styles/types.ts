export type subPallette = {
  primary: string;
  secondary: string;
  strong: string;
  warning: string;
  error: string;
  success: string;
  info: string;
  base: string;
  title: string;
  subtitle: string;
  disabled: string;
};

export type pallette = {
  bg: subPallette;
  text: subPallette;
  shadow: subPallette;
  border: subPallette;
  overlay: subPallette;
  ring: subPallette;
};

export type ThemeType = "high_contrast" | "grayscale" | "monochromatic"

export type theme = {
  colors: {
    button: pallette;
    border: pallette;
    ring: pallette;
    bg: pallette;
    text: pallette;
    shadow: pallette;
  };
  typography: {
    base: string
  };
  breakpoints: "xs" | "phone" | "tablet" | "laptop" | "desktop" | "monitor" | "4k"

};
