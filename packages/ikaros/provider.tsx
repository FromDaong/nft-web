import { ReactNode } from "react";

export default function IkarosProvider(props: {
  children: ReactNode;
  config: object;
}) {
  return <>{props.children}</>;
}
