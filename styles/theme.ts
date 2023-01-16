import {
	mauve,
	purple,
	red,
	teal,
	pink,
	sky,
	mint,
	amber,
	crimson,
	gray,
	grayDark,
	crimsonDark,
	mauveDark,
	purpleDark,
	redDark,
	tealDark,
	pinkDark,
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
	...teal, // Success
	...purple,
	...mauve,
	...red, // Error
	...pink,
	...mint, // Success
	...amber, // Warning
	...sky, // Info
	...crimson,
	...gray,
	white: "#fff",

	// Black foreground text at step 9 bg
};

const baseColorsDark = {
	...mauveDark,
	...purpleDark,
	...redDark,
	...tealDark,
	...pinkDark,
	...crimsonDark,
	...grayDark,
};

//T-40 Theme colors OG pink = https://www.happyhues.co/palettes/7

export const darkTheme = createTheme("dark", {
	colors: {
		...baseColorsDark,
		overlay: "#606060a1",
		overlayContrast: "#606060eb",
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

		successBase: "$teal1",
		successBgSubtle: "$teal2",
		successBg: "$teal3",
		successBgHover: "$teal4",
		successBgActive: "$teal5",
		successLine: "$teal6",
		successBorder: "$teal7",
		successBorderHover: "$teal8",
		successSolid: "$teal9",
		successSolidHover: "$teal10",
		successText: "$teal11",
		successTextContrast: "$teal12",

		surface: "$mauve2",
		elementSurface: "$mauve1",
		surfaceOnSurface: "$mauve3",
		elementOnSurface: "$mauve4",
		hoveredElementSurface: "$mauve5",
		selectedElementSurface: "$mauve6",
		solidSurface: "$mauve9",
		selectedSolidSurface: "$mauve10",
		text: "$mauve11",
		textContrast: "$mauve12",
		mutedText: "$mauve11",
		border: "$mauve7",
		subtleBorder: "$mauve6",

		btnCallToAction: "#ff6988",
		btnCallToActionDisabled: "#ffc1d7",
		accentCallToAction: "#9b22d3",
		totmPurple: "#9c24ff",
		buttonSurface: "$surface",
		textOnSurface: "$text",
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
	shadows: {},
	zIndices: {},
	transitions: {},
});

export const lightTheme = createTheme("light", {
	colors: {
		...baseColors,
		overlay: "#00000053",
		overlayContrast: "#696969de",
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

		successBase: "$teal1",
		successBgSubtle: "$teal2",
		successBg: "$teal3",
		successBgHover: "$teal4",
		successBgActive: "$teal5",
		successLine: "$teal6",
		successBorder: "$teal7",
		successBorderHover: "$teal8",
		successSolid: "$teal9",
		successSolidHover: "$teal10",
		successText: "$teal11",
		successTextContrast: "$teal12",

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
		elementSurface: "#ffffff",
		surfaceOnSurface: "$gray3",
		elementOnSurface: "$gray4",
		hoveredElementSurface: "$gray5",
		selectedElementSurface: "$gray6",
		solidSurface: "$gray9",
		selectedSolidSurface: "$gray10",
		text: "$gray11",
		textContrast: "$gray12",
		mutedText: "$gray9",
		border: "$gray7",
		subtleBorder: "$gray6",

		btnCallToAction: "#ff6988",
		btnCallToActionDisabled: "#ffc1d7",
		accentCallToAction: "#9b22d3",
		totmPurple: "#9c24ff",
		buttonSurface: "$surface",
		textOnSurface: "$text",

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
	shadows: {},
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
		primary1: "#ffd4da",
		primary2: "#F8BFD4",
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

		successBase: "$teal1",
		successBgSubtle: "$teal2",
		successBg: "$teal3",
		successBgHover: "$teal4",
		successBgActive: "$teal5",
		successLine: "$teal6",
		successBorder: "$teal7",
		successBorderHover: "$teal8",
		successSolid: "$teal9",
		successSolidHover: "$teal10",
		successText: "$teal11",
		successTextContrast: "$teal12",

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

		surface: "$primary1",
		surfaceOnSurface: "$primary1",
		elementSurface: "$primary4",
		elementOnSurface: "$primary2",
		hoveredElementSurface: "$primary3",
		selectedElementSurface: "$primary4",
		solidSurface: "$primary3",
		selectedSolidSurface: "$primary4",
		text: "$mauve12",
		textContrast: "$gray12",
		mutedText: "$gray11",
		border: "$primary3",
		subtleBorder: "#ffdce0",

		btnCallToAction: "#ff6988",
		btnCallToActionDisabled: "#ffc1d7",
		accentCallToAction: "#9b22d3",
		totmPurple: "#9c24ff",
		buttonSurface: "$primary4",
		textOnSurface: "#ffffff",
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
	shadows: {},
	zIndices: {},
	transitions: {},
});
// T-41 Favicon size must drop
