import { Container } from "@packages/shared/components/Container";
import { ComponentBasicProps } from "core/TreatCore";

export default function FeaturedFrame({ children }: ComponentBasicProps) {
  return <Container className="flex flex-col gap-12">{children}</Container>;
}
