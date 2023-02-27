import {ReactNode} from "react";
import {Button} from "../Button";

export function PaginationButton(props: {
	children: ReactNode;
	onClick: (e?) => void;
	active?: boolean;
}) {
	return (
		<Button
			aria-disabled={props.active}
			onClick={props.onClick}
			css={{
				display: "flex",
				backgroundColor: props.active ? "$elementOnSurface" : "$elementSurface",
				color: props.active ? "$textContrast" : "$textOnSurface",
				padding: "4px 8px",
			}}
		>
			{props.children}
		</Button>
	);
}

export function NextButton(props: {next: () => void}) {
	return <PaginationButton onClick={props.next}>Next</PaginationButton>;
}

export function PrevButton(props: {prev: () => void}) {
	return <PaginationButton onClick={props.prev}>Prev</PaginationButton>;
}

export function GotoFirstButton(props: {gotoFirst: () => void}) {
	return <PaginationButton onClick={props.gotoFirst}>First</PaginationButton>;
}

export function GotoLastButton(props: {gotoLast: () => void}) {
	return <PaginationButton onClick={props.gotoLast}>Last</PaginationButton>;
}
