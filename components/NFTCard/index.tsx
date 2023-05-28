import Link from "next/link";
import {Container} from "@packages/shared/components/Container";
import {DetailSection} from "./DetailSection";
import ActionSection from "./ActionSection";
import WishlistSection from "./WishlistSection";
import OwnershipSection from "./OwnershipSection";
import CreatorTag from "./tags/CreatorTag";
import ProtectedTag from "./tags/ProtectedTag";
import {MediaContainer} from "./media/MediaContainer";
import {Price} from "./atoms/Price";
import {ListedBy} from "./atoms/ListedBy";
import {Collection} from "./atoms/Collection";
import MarketType, {SoldOutTag} from "./atoms/MarketType";
import {ReactNode} from "react";
import NFTMediaRenderer from "./media/MediaRenderer";
import Owned from "./atoms/Owned";
import {NFTCardDropdownMenu} from "./dropdowns";

// T-84 Sold out status should come from the subgraph
export const NFTCard = (props: {children: ReactNode; _id: string}) => {
	return (
		<Container
			className={`flex flex-col gap-2 pb-4 w-full overflow-hidden rounded-xl shadow-sm border`}
			css={{
				borderColor: "$subtleBorder",
				borderRadius: "12px",
				backgroundColor: "$surfaceOnSurface",
			}}
		>
			{props.children}
		</Container>
	);
};

NFTCard.Detail = DetailSection;
NFTCard.Actions = ActionSection;
NFTCard.Wishlist = WishlistSection;
NFTCard.OwnerUtils = OwnershipSection;
NFTCard.Creator = CreatorTag;
NFTCard.Protected = ProtectedTag;
NFTCard.RenderMedia = NFTMediaRenderer;
NFTCard.Media = MediaContainer;
NFTCard.Price = Price;
NFTCard.ListedBy = ListedBy;
NFTCard.Collection = Collection;
NFTCard.MarketStatus = MarketType;
NFTCard.SoldOut = SoldOutTag;
NFTCard.Owned = Owned;
NFTCard.DropdownActions = NFTCardDropdownMenu;
