import {styled} from "@styles/theme";

export const Input = styled("input", {
	padding: "12px",
	backgroundColor: "$inputSurface",
	color: "$textContrast",
	width: "100%",
	borderRadius: "8px",
	"&focus:": {
		border: "1px solid $accentText",
	},
	border: "1px solid $border",

	variants: {
		shadow: {
			true: {
				boxShadow: "$base",
			},
		},
		outlined: {
			true: {
				border: "1px solid $border",
			},
		},
		appearance: {
			solid: {
				backgroundColor: "$surface",
				color: "$textContrast",
				border: 0,
				"&focus:": {
					border: "1px solid $accentText",
				},
			},
		},
	},
});

export const Textarea = styled("textarea", {
	padding: "8px 12px",
	backgroundColor: "$inputSurface",
	color: "$textContrast",
	width: "100%",
	borderRadius: "16px",
});
