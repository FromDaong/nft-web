import {BigNumber, ethers} from "ethers";

export const formatOpenOrders = (openOrders) =>
	openOrders.map((o) => {
		const order = {...o};
		if (!order.nftId) return;
		return {
			seller: order.seller,
			nftId: Number(order.nftId?.toString()),
			price: Number(ethers.utils.formatEther(order.price)),
			listDate: Number(BigNumber.from(order.listDate).toString()),
		};
	});

export type OpenOrder = {
	seller: string;
	nftId: number;
	price: number;
	listDate: number;
};

export type OpenOrdersPagination = {
	docs: Array<OpenOrder>;
	total: number;
	page: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	next: number | null;
	prev: number | null;
};

export class OpenOrdersManager {
	openOrders: Array<OpenOrder>;

	constructor(openOrders: Array<OpenOrder>) {
		this.openOrders = openOrders.filter((order) => order.nftId > 370);
	}

	newestFirst() {
		return this.openOrders.sort(function (a, b) {
			return b.listDate - a.listDate;
		});
	}

	oldestFirst() {
		return this.openOrders.sort(function (a, b) {
			return a.listDate - b.listDate;
		});
	}

	cheapestFirst() {
		return this.openOrders.sort(function (a, b) {
			return a.price - b.price;
		});
	}

	expensiveFirst() {
		return this.openOrders.sort(function (a, b) {
			return b.price - a.price;
		});
	}

	bySeller(address: string) {
		return this.openOrders.filter((order) => order.seller === address);
	}

	byID(id: number) {
		return this.openOrders.filter((order) => order.nftId === id);
	}

	paginate(
		page: number,
		orderedOrders: Array<OpenOrder>,
		delta = 24
	): OpenOrdersPagination {
		const data = {
			total: orderedOrders.length,
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

		data.docs = orderedOrders.slice(
			(page - 1) * delta,
			(page - 1) * delta + delta
		);

		return data;
	}
}
