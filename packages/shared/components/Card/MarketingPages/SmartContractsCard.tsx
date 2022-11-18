import { CardDetailSection, HeadlessCard } from "..";
import { Button } from "../../Button";
import { Container } from "../../Container";
import { ContextualHeading, Text } from "../../Typography/Headings";

export default function SmartContracts() {
  return (
    <Container>
      <div style={{ maxWidth: "60%", display: "block" }}>
        <CardDetailSection>
          <ContextualHeading>
            Verified, open-source projects from the TreatDAO team
          </ContextualHeading>
          <Text>
            TreatDAO is a community owned project built to life easier for
            content creators. All the contracts used on TreatDAO projects are
            open source and verified on supported blockchains.
          </Text>
        </CardDetailSection>

        <Button>Contribute on GitHub</Button>
      </div>
    </Container>
  );
}
