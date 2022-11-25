import { Container } from "@packages/shared/components/Container";

export default function OverlayContent({ children }) {
  return (
    <Container style={{ height: "100%", width: "100%", zIndex: 5 }}>
      {children}
    </Container>
  );
}
