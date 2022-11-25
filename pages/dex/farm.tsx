import StakeTreat from "@packages/dex/StakeTreat";
import StakeTreatBNB from "@packages/dex/StakeTreatBNB";
import { SEOHead } from "@packages/seo/page";
import { Button } from "@packages/shared/components/Button";
import {
  Container,
  ContextualContainer,
} from "@packages/shared/components/Container";
import { Heading, Text } from "@packages/shared/components/Typography/Headings";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function Swap() {
  return (
    <div>
      <SEOHead title={"Treat Farm"} />
      <ApplicationLayout>
        <ApplicationFrame>
          <ContextualContainer>
            <Heading className="mb-2" size="md">
              Farming Dashboard
            </Heading>
            <Text>
              Stake $Treat to earn $Melon. Exchange $Melon at the Farmers'
              Market to get exclusive NFTs.
            </Text>
          </ContextualContainer>
          <Container className="mt-12 w-full flex justify-between items-baseline">
            <Heading size="xs">Melon Balance:</Heading>
            <Button>Go to Farmers' 🍈 Market</Button>
          </Container>
          <Container className="mt-8">
            <StakeTreat />
          </Container>
          <Container className="mt-8">
            <StakeTreatBNB />
          </Container>
        </ApplicationFrame>
      </ApplicationLayout>
    </div>
  );
}
