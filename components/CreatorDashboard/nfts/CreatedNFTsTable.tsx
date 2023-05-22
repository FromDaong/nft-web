/* eslint-disable no-mixed-spaces-and-tabs */
import {ColumnDef} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@components/ui/table";
import {Payment} from "./types";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Text";
import {Checkbox} from "@components/ui/checkbox";
import {Button} from "@packages/shared/components/Button";
import {DotsHorizontalIcon, PencilAltIcon} from "@heroicons/react/outline";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export const CreatedNFTsColumns: ColumnDef<Payment>[] = [
	{
		id: "select",
		header: ({table}) => (
			<>
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					aria-checked={table.getIsAllPageRowsSelected()}
				/>
			</>
		),
		cell: ({row}) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({row}) => {
			const amount = parseFloat(row.getValue("price"));
			const formatted = new Intl.NumberFormat("en-US", {
				maximumFractionDigits: 6,
				unitDisplay: "long",
				useGrouping: true,
			}).format(amount);

			return (
				<Container>
					<Text>{formatted} BNB</Text>
				</Container>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "totalSales",
		header: () => <div className="text-right">Total sales</div>,
		cell: ({row}) => {
			const amount = parseFloat(row.getValue("totalSales"));
			const formatted = new Intl.NumberFormat("en-US", {
				maximumFractionDigits: 6,
				unitDisplay: "long",
				useGrouping: true,
			}).format(amount);

			return (
				<Container className={"text-right"}>
					<Text>{formatted}</Text>
				</Container>
			);
		},
	},
	{
		accessorKey: "totalRevenue",
		header: () => <div className="text-right">Total revenue</div>,
		cell: ({row}) => {
			const amount = parseFloat(row.getValue("totalRevenue"));
			const formatted = new Intl.NumberFormat("en-US", {
				maximumFractionDigits: 6,
				unitDisplay: "long",
				useGrouping: true,
			}).format(amount);

			return (
				<Container className={"text-right"}>
					<Text>{formatted} BNB</Text>
				</Container>
			);
		},
	},
	{
		id: "actions",
		cell: ({row}) => {
			const payment = row.original;

			return (
				<Container className="flex justify-end">
					<Button appearance={"link"}>
						<PencilAltIcon className="w-5 h-5" />
					</Button>
					<Button appearance={"link"}>
						<DotsHorizontalIcon className="w-5 h-5" />
					</Button>
				</Container>
			);
		},
	},
];

export function CreatedNFTsDatatable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Container
			className="border rounded-xl"
			css={{borderColor: "$border", backgroundColor: "$surfaceOnSurface"}}
		>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Container>
	);
}

const data = [
	{
		id: "32",
		amount: 100,
		status: "Minting",
		email: "m@example.com",
		price: 0.002,
		name: "This NFT has a really really long name",
		totalSales: 689,
		totalRevenue: 1.562,
	},
	{
		id: "321",
		amount: 100,
		status: "Minting",
		email: "m@example.com",
		price: 0.002,
		name: "This NFT has a really really long name",
		totalSales: 689,
		totalRevenue: 1.562,
	},
	// ...
];

export default function CreatedNFTsTable() {
	return (
		<div className="container py-10 mx-auto">
			<CreatedNFTsDatatable
				columns={CreatedNFTsColumns}
				data={data}
			/>
		</div>
	);
}
