import {styled} from "@styles/theme";
import {cva, type VariantProps} from "class-variance-authority";

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
	borderRadius: "8px",
	fontFamily: "'Helvetica', sans-serif",
	fontWeight: "600",
	justifyContent: "center",
	alignContent: "center",
	flexShrink: 0,

	variants: {
		appearance: {
			default: {
				backgroundColor: "$pink5",
				color: "$white",
				"&hover:": {
					backgroundColor: "$pink3",
				},
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
				backgroundColor: "$red4",
				color: "$red12",
				boxShadow: "$shadow",
			},
			disabled: {
				opacity: 0.7,
			},
			accent: {
				backgroundColor: "$accentText",
				color: "$accentBg",
			},
			loading: {
				backgroundColor: "$surfaceOnSurface",
				opacity: 0.6,
				color: "$text",
			},
			link: {
				backgroundColor: "inherit",
				color: "$textContrast",
				"&hover:": {
					backgroundColor: "$elementOnSurface",
				},
			},
		},
		outlined: {
			true: {
				backgroundColor: "$white",
				color: "$textContrast",
				boxShadow: "$shadow",
			},
		},
		active: {
			true: {
				backgroundColor: "$textContrast",
				color: "$surface",
			},
		},
		fullWidth: {
			true: {
				width: "100%",
			},
		},
		activeLink: {
			true: {
				backgroundColor: "$accentSolid",
				color: "$accentBase",
			},
		},
		size: {
			sm: {
				fontSize: "14px",
				padding: "4px 8px",
			},
		},
		noPadding: {
			true: {padding: 0},
		},
	},
	defaultVariants: {
		appearance: "default",
	},
});

export const WhiteButton = styled(Button, {
	backgroundColor: "white",
	boxShadow: "0px 2px 6px rgba(37, 41, 46, 0.04);",
	color: "#25292e",
});

export const button = cva(["font-semibold", "border", "rounded"], {
	variants: {
		intent: {
			primary: [
				"bg-blue-500",
				"text-white",
				"border-transparent",
				"hover:bg-blue-600",
			],
			// **or**
			// primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
			secondary: [
				"bg-white",
				"text-gray-800",
				"border-gray-400",
				"hover:bg-gray-100",
			],
		},
		size: {
			small: ["text-sm", "py-1", "px-2"],
			medium: ["text-base", "py-2", "px-4"],
		},
	},
	compoundVariants: [
		{
			intent: "primary",
			size: "medium",
			class: "uppercase",
			// **or** if you're a React.js user, `className` may feel more consistent:
			// className: "uppercase"
		},
	],
	defaultVariants: {
		intent: "primary",
		size: "medium",
	},
});

export interface ButtonProps
	extends React.HTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof button> {}

export const CVAButton: React.FC<ButtonProps> = ({
	className,
	intent,
	size,
	...props
}) => (
	<button
		className={button({intent, size, className})}
		{...props}
	/>
);
