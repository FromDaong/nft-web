import { ArrowRightIcon } from "@radix-ui/react-icons";
import { CardDetailSection, HeadlessCard } from "..";
import { Button } from "../../Button";
import {
  ContextualHeading,
  MutedParagraph,
  Text,
} from "../../Typography/Headings";

export default function FeaturesCard() {
  return (
    <div>
      <div style={{ maxWidth: "60%", display: "block" }}>
        <CardDetailSection>
          <ContextualHeading>
            Built by creators, for <br />
            creators and their fans
          </ContextualHeading>
          <Text>
            We have built a platform for content creators like you, leveraging
            blockchain technology to help you monetize your content and grow
            closer to your fans.
          </Text>
        </CardDetailSection>
      </div>
    </div>
  );
}
