import { Container } from "@packages/shared/components/Container";
import { ReactNode } from "react";

export default function ContentSidebar({ children }: { children: ReactNode }) {
  return (
    <Container
      css={{ width: "320px" }}
      className="hidden lg:flex flex-col gap-12 px-4 pt-12"
    >
      {children}
    </Container>
  );
}
