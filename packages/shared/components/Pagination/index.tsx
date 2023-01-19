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

const generatePreviewPages = (page, totalPages) => {
	let pages = [];

	if (totalPages < 5) {
		new Array(totalPages).fill(page).map((p, i) => pages.push(i + +1));
		return pages;
	}

	if (page === 1) {
		new Array(5).fill(page).map((p, i) => pages.push(i));
		pages = pages.slice(1, 5);
		return pages;
	}

	if (page > 2) {
		new Array(page + +3).fill(page).map((p, i) => pages.push(i));

		if (page === totalPages) {
			pages = pages.slice(totalPages - 3, totalPages + +1);
			return pages;
		}

		pages = pages.slice(page - 2, page + +3);
		return pages;
	}
};

export default function Pagination(props: PaginationProps) {
	const pagesPreview = generatePreviewPages(props.page, props.totalPages) ?? [];

	if (pagesPreview.length === 0) return null;

	return (
		<Container className="flex w-full justify-center gap-2">
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
