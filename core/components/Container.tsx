import { ReactNode } from "react";

export default function Container({
  children,
  fluid,
}: {
  children: ReactNode;
  fluid?: boolean;
}) {
  return (
    <div
      className={`container mx-auto  ${fluid ? "max-w-4xl px-4 lg:px-0" : ""}`}
    >
      {children}
    </div>
  );
}
