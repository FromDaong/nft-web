import { ArrowRightIcon } from "@radix-ui/react-icons";
import { CardDetailSection, HeadlessCard } from "..";
import { Button } from "../../Button";
import {
  ContextualHeading,
  Heading,
  MutedParagraph,
  Text,
} from "../../Typography/Headings";
import { Span } from "../../Typography/Text";

export default function FeaturesCard() {
  return (
    <div>
      <div style={{ maxWidth: "100%", display: "block" }}>
        <CardDetailSection>
          <Heading size="lg">
            A platform built by creators and fans,{" "}
            <Span>for creators and their fans</Span>
          </Heading>
        </CardDetailSection>
      </div>
    </div>
  );
}
