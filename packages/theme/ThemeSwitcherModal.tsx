import { XIcon } from "@heroicons/react/outline";
import { FullscreenOverlay } from "@packages/commandbar/components/Frame";
import { Container } from "@packages/shared/components/Container";
import { Heading, Text } from "@packages/shared/components/Typography/Headings";
import {
  ImportantText,
  MutedText,
} from "@packages/shared/components/Typography/Text";
import { styled } from "@styles/theme";
import { useUpdateTheme } from "./hooks";
import DarkTheme from "../../public/assets/svg/DarkTheme.svg";
import LightTheme from "../../public/assets/svg/LightTheme.svg";
import PinkTheme from "../../public/assets/svg/PinkTheme.svg";
import Image from "next/image";
import { ApplicationTheme } from "./provider";
import { useContext } from "react";

const ThemeCard = styled("div", {
  width: "80px",
  height: "60px",
});

const ThemeOption = ({
  name,
  currentTheme,
  updateTheme,
}: {
  name: "light" | "dark" | "pink";
  currentTheme: string;
  updateTheme: (theme: string) => void;
}) => {
  const themes = {
    dark: {
      image: DarkTheme,
      bg: "bg-gray-900",
    },
    light: {
      image: LightTheme,
      bg: "bg-gray-100",
    },
    pink: {
      image: PinkTheme,
      bg: "bg-pink-50",
    },
  };

  return (
    <Container
      className="flex flex-col gap-2"
      onClick={() => updateTheme(name)}
    >
      <ThemeCard
        css={{
          border: `${currentTheme === name ? "2" : "1"}px solid ${
            currentTheme === name ? "$accentBorder" : "$subtleBorder"
          }`,
          borderRadius: "8px",
          overflow: "hidden",
        }}
        className={`px-2 pt-4 relative ${themes[name].bg}`}
      >
        <Image
          width={72}
          height={56}
          src={themes[name].image}
          alt=""
          className="w-full h-full top-2"
          style={{ top: "4px" }}
        />
      </ThemeCard>
      <Text className="capitalize">
        <ImportantText>{name}</ImportantText>
      </Text>
    </Container>
  );
};

export default function ThemeSwitcherModal({ isOpen, onClose }) {
  const theme = useContext(ApplicationTheme);

  if (!isOpen) {
    return null;
  }
  return (
    <Container className="fixed top-0 left-0 h-screen w-screen">
      <FullscreenOverlay onClick={onClose} />
      <Container
        className="fixed w-full max-w-lg divide-y rounded-xl shadow-xl p-8"
        css={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2000,
          backgroundColor: "$surface",
          borderRadius: "16px",
        }}
      >
        <Container className="flex flex-col gap-8">
          <Container className="flex justify-between">
            <Container className="flex flex-col gap-1">
              <Heading size="sm">Theme</Heading>
              <Text>
                <MutedText>Select the theme you would like to use.</MutedText>
              </Text>
            </Container>
            <Text>
              <XIcon onClick={onClose} className="w-5 x-5" />
            </Text>
          </Container>
          <Container className="flex gap-8">
            <ThemeOption
              currentTheme={theme.theme}
              updateTheme={theme.updateTheme}
              name="light"
            />
            <ThemeOption
              currentTheme={theme.theme}
              updateTheme={theme.updateTheme}
              name="dark"
            />
            <ThemeOption
              currentTheme={theme.theme}
              updateTheme={theme.updateTheme}
              name="pink"
            />
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
