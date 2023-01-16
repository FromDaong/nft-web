import {styled} from "@styles/theme";

export const Input = styled("input", {
	padding: "12px",
	backgroundColor: "$inputSurface",
	color: "$textContrast",
	width: "100%",
	borderRadius: "8px",
});

export const Textarea = styled("textarea", {
	padding: "8px 12px",
	backgroundColor: "$inputSurface",
	color: "$textContrast",
	width: "100%",
	borderRadius: "16px",
});
