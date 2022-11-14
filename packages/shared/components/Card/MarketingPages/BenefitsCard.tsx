import { styled } from "@styles/theme";
import { Button } from "../../Button";
import { ContextualHeading } from "../../Typography/Headings";
import { AccentText, Text } from "../../Typography/Text";

const gradients = {
  FAN: "linear-gradient(rgb(255 245 253) 0%, rgb(250 242 247) 100%)",
  CREATOR: "linear-gradient(rgb(251 248 255) 0%, rgb(241 242 252) 100%)",
};

const Card = styled("div", {
  borderRadius: "30px",
  padding: "48px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "70vh",
  textAlign: "center !important",
  boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.06)",
  border: "1px solid $mauveA4",
  justifyContent: "space-between",
});

export const BenefitsCard = ({ title, description, image, user_type }) => {
  return (
    <Card style={{ background: gradients[user_type] }}>
      <div className="flex flex-col items-center w-full text-center">
        <AccentText>FOR {user_type}S</AccentText>
        <ContextualHeading>{title}</ContextualHeading>
        <Text>{description}</Text>
      </div>
      <Button>Sign in with your wallet</Button>
    </Card>
  );
};
