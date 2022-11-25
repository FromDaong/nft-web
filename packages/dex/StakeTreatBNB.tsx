import { Input } from "@packages/form";
import { Button } from "@packages/shared/components/Button";
import { Container } from "@packages/shared/components/Container";
import {
  Heading,
  ImportantSmallText,
  Text,
} from "@packages/shared/components/Typography/Headings";
import { styled } from "@styles/theme";

export default function StakeTreatBNB() {
  return (
    <Container
      css={{ border: "1px solid $subtleBorder", borderRadius: "30px" }}
      className="w-full p-8 gap-8 flex flex-col"
    >
      <Container className="flex justify-center">
        <Heading size="sm">Stake $TREAT/BNB</Heading>
      </Container>
      <Container className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        <Container className="col-span-1 h-auto">
          <Container className="mb-6">
            <Heading size="xs">Balance</Heading>
            <Text>
              <ImportantSmallText>0.000</ImportantSmallText>
              $Treat/BNB
            </Text>
          </Container>
          <Container>
            <form>
              <Input className="px-2 py-1 px-4 py-3 mb-2" value={0} />
            </form>
          </Container>
          <Button appearance={"surface"}>Approve Contract</Button>
        </Container>
        <Container className="col-span-1 h-auto">
          <Container className="mb-6">
            <Heading size="xs">Staked</Heading>
            <Text>
              <ImportantSmallText>0.000</ImportantSmallText>
              Treat/BNB
            </Text>
          </Container>
          <Container>
            <form>
              <Input className="px-2 py-1 px-4 py-3 mb-2" value={0} />
            </form>
          </Container>
          <Button appearance={"surface"}>Approve Contract</Button>
        </Container>
        <Container className="col-span-1 h-auto md:col-span-2 lg:col-span-1 md:flex flex-col items-center justify-between">
          <Container className="mb-6">
            <Heading size="xs">Unclaimed Rewards</Heading>
            <Text>
              <ImportantSmallText>0.000</ImportantSmallText>
              Melon
            </Text>
          </Container>
          <Button>Claim $Melon Rewards</Button>
        </Container>
      </Container>
    </Container>
  );
}
