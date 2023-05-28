// @ts-nocheck
import {forwardRef} from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import {styled} from "@styles/theme";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/outline";
import {Checkbox} from "@components/ui/checkbox";
import {Container} from "@packages/shared/components/Container";
import {ImportantText, Text} from "@packages/shared/components/Typography/Text";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {ArrowUpDown} from "lucide-react";
import {Button} from "@packages/shared/components/Button";

export const SelectTrigger = styled(Select.Trigger, {
	backgroundColor: "$surfaceOnSurface",
	borderColor: "$subtleBorder",
	padding: "4px 12px",
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

const SelectItem = forwardRef(
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

type Sort = {
	config: {
		default: string;
		options: Array<{
			label: string;
			value: string;
		}>;
	};
};

export default function SortBy() {
	return (
		<Select.Root defaultValue="newest">
			<SelectTrigger
				className="inline-flex items-center justify-between gap-4 p-2 rounded-full w-fit"
				aria-label="Sort by"
				appearance={"surface"}
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
