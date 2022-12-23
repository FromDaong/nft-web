import {styled} from "@styles/theme";

export const TriggerButton = styled("p", {
	fontWeight: 600,
	padding: "8px 16px",
	alignItems: "center",
	gap: "6px",
	display: "flex",
});

export const Button = styled("button", {
	padding: "8px 16px",
	alignItems: "center",
	gap: "8px",
	display: "flex",
	borderRadius: "12px",
	boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.01)",
	fontFamily: "'Helvetica', sans-serif",
	fontWeight: "700",
	justifyContent: "center",
	alignContent: "center",

	variants: {
		appearance: {
			default: {
				backgroundColor: "$surface",
				color: "$textContrast",
			},
			primary: {
				backgroundColor: "$btnCallToAction",
				color: "$surface",
			},
			action: {
				backgroundColor: "$textContrast",
				color: "$surface",
			},
			surface: {
				backgroundColor: "$elementOnSurface",
				color: "$textContrast",
			},
			outline: {
				backgroundColor: "$surface",
				color: "$textContrast",
				border: "1.5px solid $textContrast",
			},
			subtle: {
				backgroundColor: "$surfaceOnSurface",
			},
			unstyled: {
				padding: 0,
			},
			danger: {
				backgroundColor: "$red2",
			},
			disabled: {
				backgroundColor: "$surfaceOnSurface",
				color: "$gray8",
			},
			accent: {
				backgroundColor: "$accentText",
				color: "$accentBg",
			},
		},
		outlined: {
			true: {
				border: "2px solid $subtleBorder",
				backgroundColor: "transparent",
				color: "$textContrast",
			},
		},
		fullWidth: {
			true: {
				width: "100%",
			},
		},
		link: {
			true: {
				backgroundColor: "transparent",
				color: "$textContrast",
				padding: 0,
			},
		},
		size: {
			sm: {
				fontSize: "14px",
				padding: "4px 8px",
			},
		},
	},
	defaultVariants: {
		appearance: "action",
	},
});

export const WhiteButton = styled(Button, {
	backgroundColor: "white",
	boxShadow: "0px 2px 6px rgba(37, 41, 46, 0.04);",
	color: "#25292e",
});
