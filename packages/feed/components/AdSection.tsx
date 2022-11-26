import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import { Container } from "@packages/shared/components/Container";
import {
  MutedText,
  SmallText,
  Text,
} from "@packages/shared/components/Typography/Text";

export default function AdSection(props) {
  return (
    <Container className="grid grid-cols-1 gap-4">
      <Container className="flex justify-end">
        <MutedText>
          <SmallText>Promoted Ad</SmallText>{" "}
          <QuestionMarkCircleIcon className="w-4 h-4" />
        </MutedText>
      </Container>
    </Container>
  );
}
