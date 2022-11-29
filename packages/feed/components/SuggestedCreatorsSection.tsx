import { Button } from "@packages/shared/components/Button";
import { Container } from "@packages/shared/components/Container";
import { MutedText, Text } from "@packages/shared/components/Typography/Text";
import SuggestedCreatorCard from "./SuggestedCreatorCard";

export default function SuggestedCreatorsSection(props: {
  title: string;
  data: Array<object>;
}) {
  return (
    <Container
      css={{ backgroundColor: "$elementSurface", borderRadius: "16px" }}
      className="grid gap-4 grid-cols-1 p-4 shadow"
    >
      <Container>
        <Text>
          <MutedText>{props.title}</MutedText>
        </Text>
      </Container>
      <Container className="grid grid-cols-1 gap-4">
        {["kamfeska", "putinih", "tatenda"].map((i) => (
          <SuggestedCreatorCard
            key={i}
            username={i}
            display_name="Tatenda Chris"
            avatar=""
            bio="Mystery SEV. Suddenly, the site goes dark. The dashboard is red. Everything seems fucked. There's no indication why."
            isPromoted
          />
        ))}
      </Container>
    </Container>
  );
}
