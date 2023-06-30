import {Container} from "@packages/shared/components/Container";
import {styled} from "@styles/theme";

export const FrostyBackgroundContainer = styled(Container, {
	backgroundColor: "#00000033",
	color: "$white",
	backdropFilter: "blur(10px)",
	"&:hover": {
		backgroundColor: "$sand12",
		color: "$sand1 !important",
	},
	transition: "all 0.2s ease-in-out",

	variants: {
		appearance: {
			danger: {
				backgroundColor: "Red",
			},
			invert: {
				backgroundColor: "$surface",
			},
		},
	},
});
