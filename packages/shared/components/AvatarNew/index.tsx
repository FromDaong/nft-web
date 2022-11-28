import React from "react";
import { Image, Fallback, Root } from "@radix-ui/react-avatar";
import { styled } from "@styles/theme";

const AvatarRoot = styled(Root, {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  overflow: "hidden",
  userSelect: "none",
  width: "45px",
  height: "45px",
  borderRadius: "100%",
  backgroundColor: "var(--blackA3)",
});

const AvatarImage = styled(Image, {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "inherit",
});

const AvatarFallback = styled(Fallback, {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  color: "$hiContrast",
  fontSize: "15px",
  lineHeight: 1,
  fontWeight: 700,
});

type AvatarProps = {
  imageSrc: string;
  name: string;
  size?: {
    height: string;
    width: string;
  };
};

export default function Avatar(props: AvatarProps) {
  return (
    <AvatarRoot css={{ ...props.size }}>
      <AvatarImage src={props.imageSrc} alt={props.name} />
      <AvatarFallback className="AvatarFallback" delayMs={600}>
        CT
      </AvatarFallback>
    </AvatarRoot>
  );
}

export const AvatarGroup = ({
  direction,
  people,
}: {
  direction?: "vertical" | "horizontal";
  people: Array<AvatarProps>;
}) => {
  return (
    <div className={direction === "vertical" ? "flex flex-col" : "flex"}>
      {people.map((person, i) => (
        <div
          id="avatar-wrapper"
          key={person.name}
          className="relative flex"
          style={{
            height: "45px",
            width: "45px",
            marginLeft: i > 0 ? "-6px" : "-4px",
            border: "2px solid $subtleBorder",
            borderRadius: "50%",
          }}
        >
          <Avatar {...person} />
        </div>
      ))}
      <div
        style={{
          borderRadius: "50%",
          border: "2px solid $subtleBorder",
          backgroundColor: "$elementOnSurface",
        }}
      />
    </div>
  );
};
