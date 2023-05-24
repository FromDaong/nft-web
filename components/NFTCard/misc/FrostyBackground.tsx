import {Container} from "@packages/shared/components/Container";
import {styled} from "@styles/theme";

export const FrostyBackgroundContainer = styled(Container, {
	backgroundColor: "#00000033",
	backdropFilter: "blur(10px)",

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
