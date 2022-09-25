export type subPallette = {
  primary: string;
  secondary: string;
  tertiary: string;
  strong: string;
  warning: string;
  error: string;
  success: string;
  info: string;
};

export type pallette = {
  low: subPallette;
  high: subPallette;
};

export type theme = {
  colors: {
    button: pallette;
    border: pallette;
    ring: pallette;
    bg: pallette;
    text: pallette;
    shadow: pallette;
  };
};
