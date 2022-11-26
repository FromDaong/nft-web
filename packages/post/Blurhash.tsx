import { Blurhash as NativeBlurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";
import { EyeOffIcon } from "@heroicons/react/outline";
import { Container } from "@packages/shared/components/Container";
import { SmallText, Text } from "@packages/shared/components/Typography/Text";
import { Heading } from "@packages/shared/components/Typography/Headings";
import { CardOverlay } from "@packages/shared/components/Card/MarketingPages/BenefitsCard";

export default function Blurhash(props: {
  blurhash: string;
  overrideText?: string;
}) {
  return isBlurhashValid(props.blurhash).result ? (
    <div className="absolute top-0 left-0 right-0 bottom-0 h-full w-full z-1">
      <CardOverlay />
      <div className="relative h-full w-full">
        <NativeBlurhash
          resolutionX={32}
          punch={1}
          resolutionY={32}
          height={"100%"}
          width={"100%"}
          hash={props.blurhash}
          style={{ zIndex: 0 }}
        />
      </div>
      <Container
        className="flex py-12 justify-center"
        css={{
          zIndex: 5,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Container className="flex flex-col items-center h-full p-8">
          <Text css={{ color: "$surface" }}>
            <EyeOffIcon className="h-8 w-8" />
          </Text>
          <Heading css={{ color: "$surface" }} className="mt-4" size="xs">
            Protected content
          </Heading>
          <Text
            css={{ color: "$surfaceOnSurface" }}
            className="text-center mt-2"
          >
            <SmallText>{props.overrideText ?? "Purchase to View"}</SmallText>
          </Text>
        </Container>
      </Container>
    </div>
  ) : (
    <h3 className="text-center p4">Please contact admin. Invalid Blurhash.</h3>
  );
}
