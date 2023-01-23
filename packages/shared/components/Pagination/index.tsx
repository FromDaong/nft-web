import {useEffect, useMemo, useState} from "react";
import {Container} from "../Container";
import {
	GotoFirstButton,
	GotoLastButton,
	NextButton,
	PrevButton,
} from "./Buttons";
import PageNumber from "./PageNumber";

type PaginationProps = {
	hasNextPage?: boolean;
	hasPrevPage?: boolean;
	totalPages: number;
	page: number;
	nextPage?: number;
	prevPage?: number;
	cursor?: string;
	next?: () => void;
	prev?: () => void;
	gotoPage: (page: number) => void;
};

export default function Pagination(props: PaginationProps) {
	const [pagesPreview, setPages] = useState([]);
	useEffect(() => {
		const {totalPages, page} = props;
		let pages = [];

		if (totalPages < 5) {
			new Array(totalPages).fill(page).map((p, i) => pages.push(i + +1));
			setPages(pages);
			return;
		}

		if (page === 1) {
			new Array(5).fill(page).map((p, i) => pages.push(i));
			pages = pages.slice(1, 5);
			setPages(pages);
			return;
		}

		if (page > 1) {
			new Array(page + +3).fill(page).map((p, i) => pages.push(i));

			if (page === totalPages) {
				pages = pages.slice(totalPages - 3, totalPages + +1);
				if (pages[0] === 0) pages = pages.slice(1, pages.length);
				setPages(pages);
				return;
			}

			pages = pages.slice(page - 2, page + +3);
			if (pages[0] === 0) pages = pages.slice(1, pages.length);

			setPages(pages);
			return;
		}
	}, [props]);

	console.log({pagesPreview, props});

	if (pagesPreview.length === 0) return null;

	return (
		<Container className="flex justify-center w-full gap-2">
			{props.page !== props.totalPages && (
				<GotoFirstButton gotoFirst={() => props.gotoPage(1)} />
			)}
			{props.hasPrevPage && <PrevButton prev={props.prev} />}

			{pagesPreview.map((p) => (
				<PageNumber
					page={p}
					disabled={props.page === p}
					gotoPage={props.gotoPage}
					key={"pagination" + p}
				/>
			))}

			{props.hasNextPage && <NextButton next={props.next} />}
			{props.page !== props.totalPages && (
				<GotoLastButton gotoLast={() => props.gotoPage(props.totalPages)} />
			)}
		</Container>
	);
}
