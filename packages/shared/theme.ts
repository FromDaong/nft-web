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

const switchColors = (scheme: string) => {
  switch (scheme) {
    case "primary":
      return {
        text: "white",
        background: "pink-600",
      };
    case "secondary":
      return {
        text: "white",
        background: "indigo-600",
      };
    case "accent":
      return {
        text: "white",
        background: "purple-600",
      };
    case "error":
      return {
        text: "white",
        background: "red-600",
      };
    case "success":
      return {
        text: "white",
        background: "green-600"
      };
    case "warning":
      return {
        text: "white",
        background: "orange-600",
      };
    case "disabled":
      return {
        text: "disabled-text",
        background: "background",
      };
    case "ghost":
      return {
        text: "text-slate-500",
        background: " border-2 border-slate-500",
      };
    case "mono":
      return {
        text: "text-slate-500",
        background: " border-2 border-slate-500",
      };
    default:
      return {
        text: "white",
        background: "pink-600",
      };
  }
}

export const getColorScheme = (scheme: ThemeColorOption) => {
  // Get text and background color for a given color scheme
  const {background: bg, text} = switchColors(scheme);
  const shadow = `${bg}/40`;
  const border = `${bg}/20`;

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
