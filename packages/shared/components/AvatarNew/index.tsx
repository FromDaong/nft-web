import React from "react";
import {Image, Fallback, Root} from "@radix-ui/react-avatar";
import {styled} from "@styles/theme";
import Avvvatars from "avvvatars-react";

const AvatarRoot = styled(Root, {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	verticalAlign: "middle",
	overflow: "hidden",
	userSelect: "none",
	width: "45px",
	height: "45px",
	borderRadius: "100%",
	backgroundColor: "var(--blackA3)",
});

const AvatarImage = styled(Image, {
	width: "100%",
	height: "100%",
	objectFit: "cover",
	borderRadius: "inherit",
});

const AvatarFallback = styled(Fallback, {
	width: "100%",
	height: "100%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: "white",
	color: "$hiContrast",
	fontSize: "15px",
	lineHeight: 1,
	fontWeight: 700,
});

type AvatarProps = {
	imageSrc: string;
	username: string;
	size_def?: {
		height: string;
		width: string;
	};
	size?: number;
	position?: "normal" | "transform";
};

export default function NewAvatar(props: AvatarProps) {
	const profilePicUrl = `${props.imageSrc}`;

	const size = {
		height: props.size ? `${props.size}px` : "45px",
		width: props.size ? `${props.size}px` : "45px",
	};
	return (
		<AvatarRoot css={props.size_def ? {...props.size_def} : {...size}}>
			<AvatarImage
				src={profilePicUrl}
				alt={props.username}
				className="object-cover"
			/>
		</AvatarRoot>
	);
}

export const AvatarGroup = ({
	direction,
	people,
}: {
	direction?: "vertical" | "horizontal";
	people: Array<AvatarProps>;
}) => {
	return (
		<div className={direction === "vertical" ? "flex flex-col" : "flex"}>
			{people.map((person, i) => (
				<div
					id="avatar-wrapper"
					key={person.username}
					className="relative flex"
					style={{
						height: "45px",
						width: "45px",
						marginLeft: i > 0 ? "-6px" : "-4px",
						border: "2px solid $subtleBorder",
						borderRadius: "50%",
					}}
				>
					<NewAvatar {...person} />
				</div>
			))}
			<div
				style={{
					borderRadius: "50%",
					border: "2px solid $subtleBorder",
					backgroundColor: "$elementOnSurface",
				}}
			/>
		</div>
	);
};
