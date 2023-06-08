import {Container} from "@packages/shared/components/Container";
import {styled} from "@styles/theme";

export const FrostyBackgroundContainer = styled(Container, {
	backgroundColor: "#00000033",
	color: "$sand1",
	backdropFilter: "blur(10px)",
	"&:hover": {
		backgroundColor: "$white",
		color: "$textContrast !important",
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
