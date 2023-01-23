import TreatCore from "core/TreatCore";
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
