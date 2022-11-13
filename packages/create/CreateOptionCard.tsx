import { styled } from "@styles/theme";
import Link from "next/link";
import { ReactNode } from "react";

const Card = styled("div", {
  border: "1px solid rgba(0, 0, 0, 0.14)",
  borderRadius: "20px",
  boxShadow: "box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.02)",
  minWidth: "400px !important",
  maxWidth: "520px !important",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "&:hover": {
    border: "2px solid rgba(0, 0, 0, 0.90)",
  },
});

const CardHeading = styled("h4", {
  fontSize: "18px",
});

const MutedParagraph = styled("p", {
  fontSize: "14px",
  color: "#858585",
});

const TextBoxContainer = styled("div", {
  width: "70%",
  padding: "24px",
});

const IconContainer = styled("p", {
  padding: "24px",

  svg: {
    strokeWidth: "1px",
  },
});

export default function CreateOptionCard({
  title,
  description,
  url,
  icon,
}: {
  title: string;
  description: string;
  url: string;
  icon: ReactNode;
}) {
  return (
    <Link href={url}>
      <a>
        <Card>
          <TextBoxContainer>
            <CardHeading>{title}</CardHeading>
            <MutedParagraph className="mt-1">{description}</MutedParagraph>
          </TextBoxContainer>
          <IconContainer>{icon}</IconContainer>
        </Card>
      </a>
    </Link>
  );
}
