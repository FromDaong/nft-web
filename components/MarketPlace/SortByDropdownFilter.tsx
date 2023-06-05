// @ts-nocheck
import {forwardRef, useEffect, useState} from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import {styled} from "@styles/theme";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/outline";
import {Checkbox} from "@components/ui/checkbox";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {ArrowUpDown} from "lucide-react";
import {Button} from "@packages/shared/components/Button";
import {useRouter} from "next/router";

export const SelectTrigger = styled(Select.Trigger, {
	fontWeight: 600,
});

export const SelectContent = styled(Select.Content, {
	backgroundColor: "$surfaceOnSurface",
	borderColor: "$subtleBorder",
	zIndex: 50,
	minWidth: "180px",
});

const BaseSelectItem = styled(Select.Item, {
	"&:hover": {
		backgroundColor: "$elementOnSurface",
	},
	"&data-[highlighted]:": {
		backgroundColor: "$elementOnSurface",
	},
});

export const SelectItem = forwardRef(
	({children, className, ...props}, forwardedRef) => {
		return (
			<BaseSelectItem
				className={classnames(
					"rounded-lg flex justify-between items-center p-2 relative cursor-pointer",
					className
				)}
				{...props}
				ref={forwardedRef}
			>
				<Select.ItemText>
					<Text>
						<ImportantText>{children}</ImportantText>
					</Text>
				</Select.ItemText>
				<Select.ItemIndicator className="inline-flex items-center justify-center">
					<Checkbox checked={true} />
				</Select.ItemIndicator>
			</BaseSelectItem>
		);
	}
);
SelectItem.displayName = "SelectItem";

export default function SortBy() {
	const [sortBy, setSortBy] = useState("newest"); // router.query["sort"]
	const router = useRouter();

	const handleSortBy = (value) => {
		setSortBy(value);
	};

	useEffect(() => {
		if (router.query["sort"]) {
			setSortBy(router.query["sort"]);
		}
	}, [router.query["sort"]]);

	const sortMap = {
		verified: [
			{
				label: "Total Volume",
				value: "totalSales",
			},
			{
				label: "Avalaibility",
				value: "totalVolume",
			},
		],
		resale: [
			{
				label: "Availability",
				value: "currentSupply",
			},
			{
				label: "Price",
				value: "cost",
			},
		], //"currentSupply" | "cost",
	};

	useEffect(() => {
		// update query to include sort
		router.push({
			query: {
				...router.query,
				sort: sortBy,
			},
		});
	}, [sortBy]);

	return (
		<Select.Root
			defaultValue="newest"
			onValueChange={handleSortBy}
		>
			<SelectTrigger
				className="inline-flex items-center justify-between gap-4 p-2 rounded-full w-fit"
				aria-label="Sort by"
			>
				<Button
					appearance={"surface"}
					className="transition-transform duration-300 ease-linear"
				>
					<Text>
						<ArrowUpDown className="w-5 h-5" />
					</Text>

					<Select.Value
						placeholder={
							<Text>
								<ImportantText>Newest</ImportantText>
							</Text>
						}
					/>
					<Select.Icon className="text-violet11">
						<Text>
							<ChevronDownIcon className="w-5 h-5" />
						</Text>
					</Select.Icon>
				</Button>
			</SelectTrigger>
			<Select.Portal>
				<SelectContent className="p-2 mr-4 overflow-hidden border rounded-xl drop-shadow-xl">
					<Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
						<ChevronUpIcon className="w-5 h-5" />
					</Select.ScrollUpButton>
					<Select.Viewport>
						<Select.Group>
							<SelectItem value="newest">Newest</SelectItem>
							<SelectItem value="oldest">Oldest</SelectItem>
							<SelectItem value="cheapest">Cheapest</SelectItem>
							<SelectItem value="expensive">Expensive</SelectItem>
							{sortMap[router.query["tab"]] &&
								sortMap[router.query["tab"]].map((item) => (
									<SelectItem
										key={item.value}
										value={item.value}
									>
										{item.label}
									</SelectItem>
								))}
						</Select.Group>
					</Select.Viewport>
					<Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
						<ChevronDownIcon />
					</Select.ScrollDownButton>
				</SelectContent>
			</Select.Portal>
		</Select.Root>
	);
}
