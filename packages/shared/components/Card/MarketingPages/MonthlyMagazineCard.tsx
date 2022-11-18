import { CardDetailSection, HeadlessCard } from "..";
import { Button } from "../../Button";
import { ContextualHeading, Text } from "../../Typography/Headings";
import { Overlay } from "./BenefitsCard";

export default function MonthlyMagazine() {
  return (
    <HeadlessCard appearance={"gradient"}>
      <Overlay />

      <div style={{ maxWidth: "60%", display: "block", zIndex: 1 }}>
        <CardDetailSection>
          <ContextualHeading>
            Guess what. We have a magazine we think you'll love
          </ContextualHeading>
          <Text>
            TreatDAO is a community owned project built to life easier for
            content creators. All the contracts used on TreatDAO projects are
            open source and verified on supported blockchains.
          </Text>
        </CardDetailSection>

        <Button>Explore TreatDAO magazines</Button>
      </div>
    </HeadlessCard>
  );
}
