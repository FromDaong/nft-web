import { ReactNode } from "react";
export type ThemeColorOption =
  | "primary"
  | "secondary"
  | "accent"
  | "error"
  | "success"
  | "warning"
  | "disabled"
  | "ghost"
  | "mono";

export type ComponentType =
  | "text"
  | "heading"
  | "paragraph"
  | "background"
  | "outline"
  | "subtitle"
  | "link"
  | "disabled-text"
  | "label"
  | "support-text";

export const getColorScheme = (scheme: ThemeColorOption) => {
  const bg = "blue-400";
  const text = "white";
  const shadow = "blue-400/20";
  const border = "blue-400/40";

  return (
    "bg-" + bg + " text-" + text + " shadow-" + shadow + " border-" + border
  );
};

export type ComponentThemeProps = {
  children: ReactNode;
  className?: string;
  shadow?: "xs" | "base" | "sm" | "lg" | "xl";
  size?: "sm" | "lg" | "xl" | "xs";
  rounded?: "sm" | "lg" | "xl" | "full";
  colorScheme?:
    | "primary"
    | "secondary"
    | "accent"
    | "error"
    | "success"
    | "warning"
    | "disabled"
    | "ghost"
    | "mono";
};
