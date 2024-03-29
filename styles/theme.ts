import {
	purple,
	red,
	mint,
	pink,
	sky,
	orange,
	crimson,
	sand,
	sandDark,
	crimsonDark,
	purpleDark,
	redDark,
	mintDark,
	pinkDark,
	blue,
	blueDark,
	orangeDark,
} from "@radix-ui/colors";

import {createStitches} from "@stitches/react";

export const {createTheme, styled, getCssText, globalCss, reset} =
	createStitches({
		utils: {
			marginY: (value) => ({
				marginTop: value,
				marginBottom: value,
			}),
			marginX: (value) => ({
				marginLeft: value,
				marginRight: value,
			}),
			paddingY: (value) => ({
				marginTop: value,
				marginBottom: value,
			}),
			paddingX: (value) => ({
				paddingLeft: value,
				paddingRight: value,
			}),
			maxW: (value) => {
				let w: number;

				switch (value) {
					case "sm":
						w = 640;
						break;
					case "md":
						w = 768;
						break;
					case "lg":
						w = 1024;
						break;
					case "xl":
						w = 1280;
						break;
					case "2xl":
						w = 1960;
						break;
					default:
						break;
				}
				return {
					maxWidth: `${w ? w + "px" : "100%"}`,
				};
			},
		},
		media: {
			sm: "(min-width: 640px)",
			md: "(min-width: 768px)",
			lg: "(min-width: 1024px)",
			xl: "(min-width: 1280px)",
			"2xl": "(min-width: 1960px)",
		},
	});

export const calculateColorHSL = () => {
	return {};
};

const baseColors = {
	// White foreground text at step 9 bg
	...sand,
	...purple,
	...mint, // Success
	...crimson,
	...blue,
	...orange, // Warning
	...red,
	white: "#fff",
	pink1: "#F3F1F2",
	pink2: "#FFF5F7",
	pink3: "#F396B8",
	pink4: "#DA5184",
	pink5: "#E94380",
	pink6: "#E94380",
	pink7: "#B71550",
	pink8: "#89103C",
	pink9: "#5B0B28",
	pink10: "#2E0514",
};

const baseColorsDark = {
	...sandDark,
	...purpleDark,
	...crimsonDark,
	...blueDark,
	...orangeDark,
	...mintDark,
	...redDark,
	white: "#fff",
	pink1: "#F3F1F2",
	pink2: "#FFF5F7",
	pink3: "#F396B8",
	pink4: "#DA5184",
	pink5: "#E94380",
	pink6: "#E94380",
	pink7: "#B71550",
	pink8: "#89103C",
	pink9: "#5B0B28",
	pink10: "#2E0514",
};

//T-40 Theme colors OG pink = https://www.happyhues.co/palettes/7

export const darkTheme = createTheme("dark", {
	colors: {
		...baseColorsDark,
		overlay: "#606060a1",
		overlayContrast: "#606060eb",
		overlayPowerContrast: "#60606090",
		accentBase: "$purple1",
		accentBgSubtle: "$purple2",
		accentBg: "$purple1",
		accentBgHover: "$purple4",
		accentBgActive: "$purple5",
		accentLine: "$purple6",
		accentBorder: "$purple7",
		accentBorderHover: "$purple8",
		accentSolid: "$purple9",
		accentSolidHover: "$purple10",
		accentText: "$purple11",
		accentTextContrast: "$purple12",

		successBase: "$mint1",
		successBgSubtle: "$mint2",
		successBg: "$mint3",
		successBgHover: "$mint4",
		successBgActive: "$mint5",
		successLine: "$mint6",
		successBorder: "$mint7",
		successBorderHover: "$mint8",
		successSolid: "$mint9",
		successSolidHover: "$mint10",
		successText: "$mint11",
		successTextContrast: "$mint12",

		surface: "$sand2",
		elementSurface: "$sand1",
		surfaceOnSurface: "$sand3",
		elementOnSurface: "$sand4",
		hoveredElementSurface: "$sand5",
		selectedElementSurface: "$sand6",
		solidSurface: "$sand9",
		selectedSolidSurface: "$sand10",
		text: "$sand11",
		textContrast: "$sand12",
		mutedText: "$sand11",
		border: "$sand7",
		subtleBorder: "$sand6",

		cardBg: "$surface",

		btnCallToAction: "#ff6988",
		btnCallToActionDisabled: "#ffc1d7",
		accentCallToAction: "#9b22d3",
		totmPurple: "$accentText",
		buttonSurface: "$surface",
		textOnSurface: "$textContrast",
		inputSurface: "$surfaceOnSurface",

		shadow:
			"0px 0px 2px rgba(0, 0, 0, 0.15), 0px 2px 5px rgba(0, 0, 0, 0.05), 0px 8px 40px rgba(0, 0, 0, 0.04)",
	},
	space: {
		1: "5px",
		2: "10px",
		3: "15px",
		4: "24px",
	},
	fontSizes: {
		1: "12px",
		2: "13px",
		3: "15px",
	},
	fonts: {
		untitled: "Untitled Sans, apple-system, sans-serif",
		mono: "Söhne Mono, menlo, monospace",
	},
	fontWeights: {},
	lineHeights: {},
	letterSpacings: {},
	sizes: {},
	borderWidths: {},
	borderStyles: {},
	radii: {
		base: "16px",
		tight: "8px",
		full: "50%",
	},
	shadows: {
		base: "0px 0px 2px rgba(0, 0, 0, 0.15), 0px 2px 5px rgba(0, 0, 0, 0.05), 0px 8px 40px rgba(0, 0, 0, 0.04)",
	},
	zIndices: {},
	transitions: {},
});

export const lightTheme = createTheme("light", {
	colors: {
		...baseColors,
		overlay: "#00000053",
		overlayContrast: "#696969de",
		overlayPowerContrast: "#69696990",

		overlayInvert: "#ffffff0a",
		overlayInvertContrast: "#ffffff2a",
		shadow:
			"0px 0px 2px rgba(0, 0, 0, 0.15), 0px 2px 5px rgba(0, 0, 0, 0.05), 0px 8px 40px rgba(0, 0, 0, 0.04)",
		accentBase: "$purple1",
		accentBgSubtle: "$purple2",
		accentBg: "$purple3",
		accentBgHover: "$purple4",
		accentBgActive: "$purple5",
		accentLine: "$purple6",
		accentBorder: "$purple7",
		accentBorderHover: "$purple8",
		accentSolid: "$purple9",
		accentSolidHover: "$purple10",
		accentText: "$purple11",
		accentTextContrast: "$purple12",

		successBase: "$mint1",
		successBgSubtle: "$mint2",
		successBg: "$mint3",
		successBgHover: "$mint4",
		successBgActive: "$mint5",
		successLine: "$mint6",
		successBorder: "$mint7",
		successBorderHover: "$mint8",
		successSolid: "$mint9",
		successSolidHover: "$mint10",
		successText: "$mint11",
		successTextContrast: "$mint12",

		errorBase: "$red1",
		errorBgSubtle: "$red2",
		errorBg: "$red3",
		errorBgHover: "$red4",
		errorBgActive: "$red5",
		errorLine: "$red6",
		errorBorder: "$red7",
		errorBorderHover: "$red8",
		errorSolid: "$red9",
		errorSolidHover: "$red10",
		errorText: "$red11",
		errorTextContrast: "$red12",

		surface: "#ffffff",
		elementSurface: "$sand4",
		surfaceOnSurface: "$sand2",
		elementOnSurface: "$sand3",
		hoveredElementSurface: "$sand5",
		selectedElementSurface: "$sand6",
		solidSurface: "$sand9",
		selectedSolidSurface: "$sand10",
		text: "$sand11",
		textContrast: "$sand12",
		mutedText: "$sand9",
		border: "$sand7",
		subtleBorder: "$sand6",

		btnCallToAction: "#ff6988",
		btnCallToActionDisabled: "#ffc1d7",
		accentCallToAction: "#9b22d3",
		totmPurple: "#9c24ff",
		buttonSurface: "$surface",
		textOnSurface: "$text",
		inputSurface: "$surfaceOnSurface",
		cardBg: "$white",

		featuresection_iconPinkBg: "hsl(339deg 70% 60%)",
	},
	space: {
		xs: "5px",
		sm: "10px",
		md: "15px",
		lg: "21px",
		xl: "28px",
	},
	fontSizes: {
		xs: "12px",
		sm: "13px",
		base: "17px",
		lg: "21px",
		xl: "16px",
		"2xl": "48px",
		"3xl": "96px",
	},
	fonts: {
		untitled: "Untitled Sans, apple-system, sans-serif",
		mono: "Söhne Mono, menlo, monospace",
	},
	fontWeights: {
		heading: "700",
		button: "500",
		text: "400",
		thin: "300",
	},
	lineHeights: {},
	letterSpacings: {},
	sizes: {},
	borderWidths: {},
	borderStyles: {},
	radii: {
		base: "16px",
		tight: "8px",
		full: "50%",
	},
	shadows: {
		base: "0px 0px 2px rgba(0, 0, 0, 0.15), 0px 2px 5px rgba(0, 0, 0, 0.05), 0px 8px 40px rgba(0, 0, 0, 0.04)",
	},
	zIndices: {
		base: 1,
		navbar: 10,
		overlay: 20,
		modal: 30,
		notification: 40,
		under: -1,
	},
});

export const ogPinkTheme = createTheme("pink", {
	colors: {
		...baseColors,
		primary1: "#F3F1F2",
		primary2: "#FFF5F7",
		primary3: "#F396B8",
		primary4: "#DA5184",
		primary5: "#E94380",
		primary6: "#E94380",
		primary7: "#B71550",
		primary8: "#89103C",
		primary9: "#5B0B28",
		primary10: "#2E0514",
		overlay: "#2c2c2c53",
		overlayContrast: "#2c2c2cde",
		overlayPowerContrast: "#2c2c2c90",

		overlayInvert: "#ffffff0a",
		overlayInvertContrast: "#ffffff2a",

		accentBase: "$purple1",
		accentBgSubtle: "$purple2",
		accentBg: "$purple1",
		accentBgHover: "$purple4",
		accentBgActive: "$purple5",
		accentLine: "$purple6",
		accentBorder: "$primary5",
		accentBorderHover: "$purple8",
		accentSolid: "$purple9",
		accentSolidHover: "$purple10",
		accentText: "$purple11",
		accentTextContrast: "$purple12",

		successBase: "$mint1",
		successBgSubtle: "$mint2",
		successBg: "$mint3",
		successBgHover: "$mint4",
		successBgActive: "$mint5",
		successLine: "$mint6",
		successBorder: "$mint7",
		successBorderHover: "$mint8",
		successSolid: "$mint9",
		successSolidHover: "$mint10",
		successText: "$mint11",
		successTextContrast: "$mint12",

		errorBase: "$red1",
		errorBgSubtle: "$red2",
		errorBg: "$red3",
		errorBgHover: "$red4",
		errorBgActive: "$red5",
		errorLine: "$red6",
		errorBorder: "$red7",
		errorBorderHover: "$red8",
		errorSolid: "$red9",
		errorSolidHover: "$red10",
		errorText: "$red11",
		errorTextContrast: "$red12",

		surface: "#ffd4da",
		surfaceOnSurface: "#fde4ec",
		elementSurface: "$primary4",
		elementOnSurface: "$primary2",
		hoveredElementSurface: "$primary3",
		selectedElementSurface: "$primary4",
		solidSurface: "$primary3",
		selectedSolidSurface: "$primary4",
		text: pink.pink12,
		textContrast: "$sand12",
		mutedText: "$sand9",
		border: "#eb518a",
		subtleBorder: "rgba(212,102,143,.25)",

		cardBg: "$primary1",
		cardText: "$textContrast",

		btnCallToAction: "$primary5",
		btnCallToActionDisabled: "#ffc1d7",
		accentCallToAction: "#9b22d3",
		totmPurple: "#9c24ff",
		buttonSurface: "$primary4",
		textOnSurface: "#ffffff",
		inputSurface: "$primary2",
		shadow:
			"0px 0px 2px rgba(0, 0, 0, 0.15), 0px 2px 5px rgba(0, 0, 0, 0.05), 0px 8px 40px rgba(0, 0, 0, 0.04)",
	},
	space: {
		1: "5px",
		2: "10px",
		3: "15px",
		4: "20px",
		5: "25px",
		6: "35px",
		7: "45px",
		8: "65px",
		9: "80px",
	},
	fontSizes: {
		1: "12px",
		2: "13px",
		3: "15px",
		4: "17px",
		5: "19px",
		6: "21px",
		7: "27px",
		8: "35px",
		9: "59px",
	},
	fonts: {
		untitled: "Untitled Sans, apple-system, sans-serif",
		mono: "Söhne Mono, menlo, monospace",
	},
	fontWeights: {},
	lineHeights: {},
	letterSpacings: {},
	media: {
		bp1: "(min-width: 520px)",
		bp2: "(min-width: 900px)",
		bp3: "(min-width: 1200px)",
		bp4: "(min-width: 1800px)",
		motion: "(prefers-reduced-motion)",
		hover: "(any-hover: hover)",
		dark: "(prefers-color-scheme: dark)",
		light: "(prefers-color-scheme: light)",
	},
	borderWidths: {},
	borderStyles: {},
	radii: {
		base: "16px",
		tight: "8px",
		full: "50%",
	},
	shadows: {
		base: "0px 0px 2px rgba(0, 0, 0, 0.15), 0px 2px 5px rgba(0, 0, 0, 0.05), 0px 8px 40px rgba(0, 0, 0, 0.04)",
	},
	zIndices: {},
	transitions: {},
});
// T-41 Favicon size must drop
