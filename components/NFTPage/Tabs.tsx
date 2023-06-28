import * as Tabs from "@radix-ui/react-tabs";
import ResaleListings from "./ResaleListings";
import Activity from "./Activity";
import {styled} from "@stitches/react";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {FingerPrintIcon} from "@heroicons/react/outline";
import {Store} from "lucide-react";

export const TabsList = styled(Tabs.List, {
	backgroundColor: "$surface",
	borderColor: "$subtleBorder",
});
export const TabsTrigger = styled(Tabs.Trigger, {
	"&:focus": {
		outline: "none",
		boxShadow: "none",
	},
	"&:hover": {
		backgroundColor: "$surface",
	},
	"&:active": {
		backgroundColor: "$textContrast",
		color: "$surface",
	},
	"&[data-state=active]": {
		backgroundColor: "$textContrast",
		color: "$surface",
	},
	padding: "8px 12px",
	borderRadius: "8px",
	backgroundColor: "$surface",
	transition: "all 0.2s ease-in-out",
});
const NFTPageTabs = ({nft}) => (
	<Tabs.Root defaultValue="resale">
		<TabsList className="gap-4 flex sticky top-0 w-full py-2 border-b">
			<TabsTrigger
				className="data-[state=active]:text-violet11 flex gap-2 items-center"
				value={"resale"}
			>
				<Store className="w-5 h-5" />
				<ImportantText>Buying options</ImportantText>
			</TabsTrigger>
			<TabsTrigger
				className="data-[state=active]:text-violet11 flex gap-2 items-center"
				value={"activity"}
			>
				<FingerPrintIcon className="w-5 h-5" />
				<ImportantText>Provenance</ImportantText>
			</TabsTrigger>
		</TabsList>
		<Tabs.Content value={"resale"}>
			<ResaleListings nft={nft} />
		</Tabs.Content>
		<Tabs.Content value={"activity"}>
			<Activity nft={nft} />
		</Tabs.Content>
	</Tabs.Root>
);

export default NFTPageTabs;
