const {
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
	amberDark,
	gray,
	grassDark,
} = require("@radix-ui/colors");
const {createThemes} = require("tw-colors");

const generateScaleFromRadixColor = (color) => {
	const scale = {};
	for (let i = 0; i <= 10; i++) {
		scale[i] = color;
	}
	return scale;
};

module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./packages/**/*.{js,ts,jsx,tsx}",
		"./core/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			primary: "#eb518a",
			primary2: "#e795b6",
			secondary: "#ecc94b",
			text: "#222222",
			colors: {
				text: "#222222",
			},
		},
	},
	plugins: [
		require("@tailwindcss/line-clamp"),
		require("tailwindcss-radix")({
			// Default: `radix`
			variantPrefix: "rdx",
		}),
		createThemes({
			themes: {
				light: {
					purple: generateScaleFromRadixColor(purple),
					red: generateScaleFromRadixColor(red),
					mint: generateScaleFromRadixColor(mint),
					pink: generateScaleFromRadixColor(pink),
					sky: generateScaleFromRadixColor(sky),
					orange: generateScaleFromRadixColor(orange),
					crimson: generateScaleFromRadixColor(crimson),
					sand: generateScaleFromRadixColor(sand),
					primary: generateScaleFromRadixColor(crimson),
					gray: generateScaleFromRadixColor(gray),
				},
				dark: {
					purple: generateScaleFromRadixColor(purpleDark),
					red: generateScaleFromRadixColor(redDark),
					mint: generateScaleFromRadixColor(mintDark),
					pink: generateScaleFromRadixColor(pinkDark),
					sky: generateScaleFromRadixColor(blueDark),
					orange: generateScaleFromRadixColor(amberDark),
					crimson: generateScaleFromRadixColor(crimsonDark),
					sand: generateScaleFromRadixColor(sandDark),
					primary: generateScaleFromRadixColor(crimsonDark),
					gray: generateScaleFromRadixColor(grassDark),
				},
				pink: {
					purple: generateScaleFromRadixColor(purple),
					red: generateScaleFromRadixColor(red),
					mint: generateScaleFromRadixColor(mint),
					pink: generateScaleFromRadixColor(pink),
					sky: generateScaleFromRadixColor(sky),
					orange: generateScaleFromRadixColor(orange),
					crimson: generateScaleFromRadixColor(crimson),
					sand: generateScaleFromRadixColor(sand),
					primary: generateScaleFromRadixColor(pink),
					gray: generateScaleFromRadixColor(gray),
				},
			},
		}),
	],
	darkMode: "class",
};
