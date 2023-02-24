export default async function navigateToPage(previous: any, numPages: number) {
	console.log({previous});
	// Define results for the remaining pages
	const result = previous.result || [];

	// Always keep the latest response around
	let response = previous;

	// Loop through the remaining pages
	for (let i = 0; i < numPages; i++) {
		// Get the next page
		response = await response.next(); //Best Practice: Always use next() to get the next page

		// Exit if we are on the last page already
		if (response.result.length == 0) break;

		// Add the results to the previous results
		result.push(...response.result);
	}

	// Apply the results to the last page
	response.result = result;

	// Return the response
	return response;
}

export type PaginationResults = {
	docs: Array<any>;
	total: number;
	page: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	next: number | null;
	prev: number | null;
};

export class PaginationManager {
	items: Array<any>;

	constructor(items: Array<any>) {
		this.items = items;
	}

	newestFirst() {
		return this.items.sort(function (a, b) {
			return (b.listedDate ?? b.listDate) - (a.listedDate ?? a.listDate);
		});
	}

	oldestFirst() {
		return this.items.sort(function (a, b) {
			return (a.listedDate ?? a.listDate) - (b.listedDate ?? b.listDate);
		});
	}

	cheapestFirst() {
		return this.items.sort(function (a, b) {
			return (a.list_price ?? a.price) - (b.list_price ?? b.price);
		});
	}

	expensiveFirst() {
		return this.items.sort(function (a, b) {
			return (b.list_price ?? b.price) - (a.list_price ?? a.price);
		});
	}

	paginate(page = 1, items: Array<any>, delta = 24): PaginationResults {
		const data = {
			total: items.length,
			totalPages: 0,
			page,
			hasNextPage: false,
			hasPrevPage: false,
			next: null,
			prev: null,
			docs: [],
		};

		data.totalPages = Math.ceil(data.total / delta);

		data.hasPrevPage = data.page > 1;
		data.hasNextPage = data.page < data.totalPages;

		data.next = data.hasNextPage ? data.page + +1 : null;
		data.prev = data.hasPrevPage ? data.page - 1 : null;

		data.docs = items.slice((page - 1) * delta, (page - 1) * delta + delta);

		return data;
	}
}
