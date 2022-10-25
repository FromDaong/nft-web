import { ComponentThemeProps } from "@packages/shared/theme";
import { Container } from "core/components";

export default function Card(props: ComponentThemeProps) {
  return (
    <Container>
      <div
        data-component-type="card"
        className={`${props.className ?? ""} ${
          props.shadow && props.shadow !== "base" ? props.shadow : "shadow-lg"
        } rounded-${
          props.rounded ? props.rounded : "xl"
        } shadow-pink-400/10`}
      >
        {props.children}
      </div>
    </Container>
  );
}
