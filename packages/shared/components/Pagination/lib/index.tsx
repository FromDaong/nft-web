import {useDebounce} from "@packages/shared/hooks";
import TreatCore from "core/TreatCore";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export const usePaginatedQuery = (
	queryKey: Array<string>,
	queryFn: (page: number) => Promise<{
		docs: Array<any>;
		hasNextPage: boolean;
		hasPrevPage: boolean;
		limit: number;
		nextPage: number;
		page: number;
		pagingCounter: number;
		prevPage: number;
		totalDocs: number;
		totalPages: number;
		cursor?: string;
	}>
) => {
	const [page, setPage] = useState(1);

	const {data, isFetching, refetch, isLoading} = TreatCore.useQuery({
		queryKey,
		queryFn: async () => queryFn(page),
		getNextPageParam: (lastPage) =>
			lastPage.hasNextPage ? lastPage.nextPage : false,
		getPreviousPageParam: (firstPage) =>
			firstPage.hasPrevPage ? firstPage.prevPage : false,
	});

	const changePage = () => {
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		changePage();
	}, [page]);

	const fetchPage = (page: number) => {
		setPage(page);
		refetch();
	};

	const fetchPreviousPage = () => {
		if (!data?.hasPrevPage) throw new Error("No previous page");
		fetchPage(page - 1);
	};

	const fetchNextPage = () => {
		if (!data?.hasNextPage) throw new Error("No next page");
		fetchPage(page + +1);
	};

	return {
		isLoading,
		isFetching,
		data,
		fetchPage,
		fetchPreviousPage,
		fetchNextPage,
		refetch,
	};
};

export const usePaginatedPage = (
	data: {
		docs: Array<any>;
		hasNextPage: boolean;
		hasPrevPage: boolean;
		limit: number;
		nextPage: number;
		page: number;
		pagingCounter: number;
		prevPage: number;
		totalDocs: number;
		totalPages: number;
		cursor?: string;
	},
	sort = "",
	q = "",
	href = false,
	dynamic_param?: {
		username: string;
	},
	p?: number
) => {
	const router = useRouter();
	const [sortBy, setSortBy] = useState(sort);
	const [searchText, setSearchText] = useState(q);
	const search = useDebounce(searchText, 400);

	useEffect(() => {
		router.push(
			{
				...(href ? {href: "/[username]"} : {}),
				query: {
					...(q ? {q: searchText} : ""),
					...(sort ? {sort: sortBy} : {}),
					...(dynamic_param ? {username: dynamic_param.username} : {}),
					p: p ?? 1,
				},
			},
			undefined,
			{shallow: true}
		);
	}, [sortBy]);

	const setSort = (s) => {
		setSortBy(s);
		console.log({s});
		router.push({
			...(href ? {href: "/[username]"} : {}),
			query: {
				...{q: searchText},
				...{sort: s},
				...(dynamic_param ? {username: dynamic_param.username} : {}),
				p: 1,
			},
		});
	};

	const nextPage = () => {
		router.push({
			...(href ? {href: "/[username]"} : {}),
			query: {
				...router.query,
				...{p: parseInt(`${data.page}`) + +1},
				...(dynamic_param ? {username: dynamic_param.username} : {}),
			},
		});
	};

	const prevPage = () => {
		router.push({
			...(href ? {href: "/[username]"} : {}),
			query: {
				...router.query,
				...{p: parseInt(`${data.page}`) - +1},
				...(dynamic_param ? {username: dynamic_param.username} : {}),
			},
		});
	};

	const gotoPage = (page) => {
		router.push({
			...(href ? {href: "/[username]"} : {}),
			query: {
				...router.query,
				p: page,
				...(dynamic_param ? {username: dynamic_param.username} : {}),
			},
		});
	};

	const performSearchWithNewParams = (e) => {
		e.preventDefault();
		console.log("searching params");

		router.push({
			...(href ? {href: "/[username]"} : {}),
			query: {
				...router.query,
				...(search ? {q: searchText} : {}),
				...(dynamic_param ? {username: dynamic_param.username} : {}),
				...{p: 1},
			},
		});
	};

	return {
		nextPage,
		prevPage,
		gotoPage,
		setSort,
		search,
		setSearchText,
		performSearchWithNewParams,
		sortBy,
		searchText,
	};
};
