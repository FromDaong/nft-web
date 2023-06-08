import * as Tabs from "@radix-ui/react-tabs";
import ResaleListings from "./ResaleListings";
import Activity from "./Activity";
import {styled} from "@stitches/react";
import {ImportantText} from "@packages/shared/components/Typography/Text";

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
				className="data-[state=active]:text-violet11"
				value={"resale"}
			>
				<ImportantText>Resale market options</ImportantText>
			</TabsTrigger>
			<TabsTrigger value={"activity"}>
				<ImportantText>Activity</ImportantText>
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
