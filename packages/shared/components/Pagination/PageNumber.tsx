import {Text} from "../Typography/Text";
import {PaginationButton} from "./Buttons";

export default function PageNumber(props: {
	page: number;
	disabled?: boolean;
	gotoPage: (page) => void;
}) {
	return (
		<PaginationButton
			active={props.disabled}
			onClick={() => !props.disabled && props.gotoPage(props.page)}
		>
			{props.page}
		</PaginationButton>
	);
}
