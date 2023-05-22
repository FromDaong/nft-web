export type Payment = {
	id: string;
	amount: number;
	status: "Minting" | "Sold out" | "Archived" | "Burnt";
	email: string;
	price: number;
	totalSales: number;
	totalRevenue: number;
};
