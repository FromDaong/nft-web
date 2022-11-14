import { ArrowRightIcon } from "@heroicons/react/solid";
import { CardDetailSection, HeadlessCard } from "..";
import { Button } from "../../Button";
import { ContextualHeading, Text } from "../../Typography/Headings";

export default function SubscriptionsCard() {
  return (
    <HeadlessCard appearance={"gradient"}>
      <div style={{ maxWidth: "60%", display: "block" }}>
        <CardDetailSection>
          <ContextualHeading>
            Recurring on-chain payments, ever heard of them?
          </ContextualHeading>
          <Text>
            TreatDAO is a community owned project built to life easier for
            content creators. All the contracts used on TreatDAO projects are
            open source and verified on supported blockchains.
          </Text>
        </CardDetailSection>

        <Button appearance={"default"}>
          Find out how we do it{" "}
          <ArrowRightIcon
            style={{
              height: "1.1rem",
              width: "1.1rem",
              marginLeft: "0.8rem",
            }}
          />
        </Button>
      </div>
    </HeadlessCard>
  );
}
