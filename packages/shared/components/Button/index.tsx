import { ComponentThemeProps, getColorScheme } from "@packages/shared/theme";
import { styled } from "@stitches/react";
import { useMemo } from "react";

export const TriggerButton = styled("p", {
  fontWeight: "500",
  padding: "8px 16px",
  alignItems: "center",
  gap: "6px",
  display: "flex",
});

export const BasicButton = styled("button", {
  fontWeight: "500",
  padding: "4px 16px",
  alignItems: "center",
  gap: "6px",
  display: "flex",
});

export const Button = (props: ComponentThemeProps) => {
  const size = useMemo(() => {
    switch (props.size) {
      case "lg":
        return "py-3 px-8";
      case "sm":
        return "py-1 px-4";
      case "xl":
        return "py-6 text-lg font-medium px-12";
      case "xs":
        return "py-1 text-xs font-medium px-2";
      default:
        return "py-2 px-6";
    }
  }, [props.size]);

  const color = useMemo(
    () => getColorScheme(props.colorScheme),
    [props.colorScheme]
  );

  return (
    <BasicButton
      className={`${!props.className.includes("text") && color} ${props.className ?? ""} ${size} ${
        props.shadow && props.shadow !== "base" ? props.shadow : "shadow-lg"
      } rounded-${
        props.rounded ? props.rounded : "xl"
      } transition-transform duration-100 hover:scale-105 font-bold`}
    >
      {props.children}
    </BasicButton>
  );
};
