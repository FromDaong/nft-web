import {ComponentThemeProps} from "@packages/shared/theme";
import {styled} from "@styles/theme";
import {Container} from "../Container";

export const HeadlessCard = styled("div", {
	borderRadius: "16px",
	padding: "42px",
	backgroundColor: "$white",
	position: "relative",
	display: "flex",

	variants: {
		appearance: {
			gradient: {
				background:
					"linear-gradient(97.43deg, rgba(82, 59, 227, 0.04) 3.74%, rgba(152, 108, 243, 0.04) 67.42%, rgba(246, 226, 255, 0.05) 120.94%)",
				border: "1px solid $border",
			},
		},
		outline: {
			true: {
				border: "1px solid $purple6",
			},
		},
	},
});

export const CardDetailSection = styled("div", {
	display: "flex",
	flexDirection: "column",
	marginBottom: "16px",
});

export default function Card(props: ComponentThemeProps) {
	return (
		<Container>
			<div
				data-component-type="card"
				className={`${props.className ?? ""} ${
					props.shadow && props.shadow !== "base" ? props.shadow : "shadow-lg"
				} rounded-${props.rounded ? props.rounded : "xl"} shadow-pink-400/10`}
			>
				{props.children}
			</div>
		</Container>
	);
}
