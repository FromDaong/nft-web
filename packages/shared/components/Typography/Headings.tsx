import {styled} from "@styles/theme";
import {
	ImportantText,
	MutedActionText,
	SmallText,
	Text,
	Username,
	MutedText,
} from "./Text";

export const Heading = styled("h1", {
	fontWeight: "600",
	color: "$textContrast",
	padding: 0,
	margin: 0,
	fontSize: "56px",

	"@sm": {
		fontSize: "36px",
	},
	"@md": {
		fontSize: "44px",
	},
	"@xl": {
		fontSize: "48px",
	},

	variants: {
		size: {
			xl: {
				fontSize: "56px",
			},
			lg: {
				fontSize: "44px",
			},
			md: {
				fontSize: "36px",
				"@sm": {
					fontSize: "20px",
				},
				"@md": {
					fontSize: "28px",
				},
				"@xl": {
					fontSize: "36px",
				},
			},
			sm: {
				fontSize: "28px",
			},
			xs: {
				fontSize: "20px",
			},
			xss: {
				fontSize: "16px",
			},
		},
		weight: {
			heavy: {
				fontWeight: "900",
			},
			bold: {
				fontWeight: "700",
			},
		},
		lineH: {
			tight: {
				lineHeight: "1.05em",
			},
		},
		appearance: {
			mute: {
				color: "$text",
			},
		},
	},

	defaultVariants: {
		size: "lg",
		lineH: "tight",
	},
});

export const ContextualHeading = styled("h3", {
	fontSize: "16px",
	marginTop: "4px",
	color: "$textContrast",
	fontWeight: "600",

	variants: {
		appearance: {
			white: {
				color: "$white",
			},
			default: {
				color: "$textContrast",
			},
		},
	},

	defaultVariants: {
		appearance: "default",
	},
});

export const ContextualHeadingContainer = styled("div", {
	marginTop: "24px",
	minWidth: "400px",
	maxWidth: "520px",
	color: "$textContrast",
});

export {
	Username,
	MutedText as MutedParagraph,
	ImportantText as ImportantSmallText,
	Text,
	SmallText,
	MutedActionText,
};
