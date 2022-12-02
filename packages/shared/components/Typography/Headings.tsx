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
	fontWeight: "700",
	color: "$textContrast",
	padding: 0,
	margin: 0,

	variants: {
		size: {
			xl: {
				fontSize: "80px",
			},
			lg: {
				fontSize: "64px",
			},
			md: {
				fontSize: "32px",
			},
			sm: {
				fontSize: "18px",
			},
			xs: {
				fontSize: "16px",
			},
			xss: {
				fontSize: "12px",
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
	},

	defaultVariants: {
		size: "lg",
		lineH: "tight",
	},
});

export const ContextualHeading = styled("h3", {
	fontSize: "32px",
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
