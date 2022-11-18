import { styled } from "@styles/theme";
import { Button } from "../../Button";
import { ContextualHeading } from "../../Typography/Headings";
import { MutedText, Text } from "../../Typography/Text";

const backgrounds = {
  FAN: "url('/assets/backgrounds/fans_card_bg.jpeg')",
  CREATOR: "url('/assets/backgrounds/fans_card_bg.jpeg')",
};

const background_positions = {
  FAN: "center top",
  CREATOR: "left",
};

const Card = styled("div", {
  borderRadius: "30px",
  padding: "48px",
  minHeight: "480px",
  textAlign: "center !important",
  justifyContent: "space-between",
  position: "relative",
  display: "flex",
});

export const Overlay = styled("div", {
  position: "absolute",
  backgroundColor: "$overlay",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderRadius: "30px",
  backdropFilter: "blur(204px)",
});

export const BenefitsCard = ({ title, description, user_type }) => {
  return (
    <Card
      css={{
        backgroundImage: backgrounds[user_type],
        backgroundPosition: background_positions[user_type],
        backgroundSize: "cover",
      }}
    >
      <Overlay />
      <div
        style={{ zIndex: "1" }}
        className="flex flex-col justify-between w-full h-full"
      >
        <div className="flex flex-col items-center w-full text-center">
          <MutedText>FOR {user_type}S</MutedText>
          <ContextualHeading>{title}</ContextualHeading>
          <Text>{description}</Text>
        </div>
        <Button>Sign in with your wallet</Button>
      </div>
    </Card>
  );
};
