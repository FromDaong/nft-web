import {XIcon} from "@heroicons/react/outline";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {styled} from "@styles/theme";
import DarkTheme from "../../public/assets/svg/DarkTheme.svg";
import LightTheme from "../../public/assets/svg/LightTheme.svg";
import PinkTheme from "../../public/assets/svg/PinkTheme.svg";
import Image from "next/image";
import {ApplicationTheme} from "./provider";
import {useContext} from "react";
import {Button} from "@packages/shared/components/Button";
import {Modal, ModalHeaderSection} from "@packages/modals";

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
					style={{top: "4px"}}
				/>
			</ThemeCard>
			<Text className="capitalize">
				<ImportantText>{name}</ImportantText>
			</Text>
		</Container>
	);
};

export default function ThemeSwitcherModal({isOpen, onClose}) {
	const theme = useContext(ApplicationTheme);

	if (!isOpen) {
		return null;
	}
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<ModalHeaderSection
				title={"Choose theme"}
				onClose={onClose}
			/>
			<Container
				className="flex gap-8 p-8 justify-center"
				css={{backgroundColor: "$surfaceOnSurface"}}
			>
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
		</Modal>
	);
}
