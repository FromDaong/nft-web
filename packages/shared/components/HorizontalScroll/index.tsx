import { ReactNode } from "react";
import HorizontalScrollButtons from "../HorizontalScrollButtons";

export default function HorizontalScroll({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <div
      className="relative flex gap-8 py-4 overflow-hidden snap-mandatory snap-x"
      id="totm-section"
    >
      <HorizontalScrollButtons />
      {children ? children : null}
    </div>
  );
}
