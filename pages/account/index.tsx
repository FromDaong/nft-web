import { Container } from "@packages/shared/components/Container";
import { Heading } from "@packages/shared/components/Typography/Headings";
import {
  MutedText,
  SmallText,
  Text,
} from "@packages/shared/components/Typography/Text";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function Settings() {
  return (
    <ApplicationLayout>
      <ApplicationFrame>
        <Container className="flex flex-col pt-12">
          <Container className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Container
              className="shadow p-4 gap-1 flex flex-col"
              css={{ borderRadius: "16px", backgroundColor: "$elementSurface" }}
            >
              <Text>Subscriptions</Text>
              <Heading size="sm">2 active</Heading>
              <Text>
                <SmallText>
                  <MutedText>Next on Tue, 23 Dec</MutedText>
                </SmallText>
              </Text>
              <Container className="py-2 flex">
                <UserAvatar size={32} value={"hey"} />
                <UserAvatar size={32} value={"chris"} />
                <UserAvatar size={32} value={"putin"} />
              </Container>
            </Container>
          </Container>
        </Container>
      </ApplicationFrame>
    </ApplicationLayout>
  );
}
