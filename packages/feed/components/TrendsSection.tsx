import { Container } from "@packages/shared/components/Container";
import { Heading } from "@packages/shared/components/Typography/Headings";
import {
  MutedText,
  SmallText,
  Text,
} from "@packages/shared/components/Typography/Text";
import TreatCore from "core/TreatCore";
import Link from "next/link";

type Trend = {
  topic: string;
  channel?: string;
  totalPosts: number;
};

export default function TrendsSection(props: { data: Array<Trend> }) {
  return (
    <Container
      css={{ backgroundColor: "$surfaceOnSurface", borderRadius: "16px" }}
      className="grid grid-cols-1 py-2"
    >
      <Container className="py-2 px-4">
        <Text>
          <MutedText>Currently trending</MutedText>
        </Text>
      </Container>
      {props.data.map((trend) => (
        <TrendingItem key={trend.topic} {...trend} />
      ))}
    </Container>
  );
}

const TrendingItem = (props: Trend) => {
  return (
    <Link href={""}>
      <a>
        <Container className="py-2 px-4 w-full flex flex-col gap-2">
          <p>
            <MutedText>
              <SmallText>{props.channel}</SmallText>
            </MutedText>
          </p>
          <p>
            <Heading size="xs">{props.topic}</Heading>
          </p>
          <p>
            <MutedText>
              <SmallText>
                {TreatCore.getFormattedNumber(props.totalPosts)} Trits
              </SmallText>
            </MutedText>
          </p>
        </Container>
      </a>
    </Link>
  );
};
