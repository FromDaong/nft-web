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
import MarketType, { SoldOutTag } from "./atoms/MarketType";
import {ReactNode} from "react";

// T-84 Sold out status should come from the subgraph
export const NFTCard = (props: {children: ReactNode; _id: string}) => {
	return (
		<Link href={`/post/nft/${props._id}`}>
			<a className="relative flex flex-col w-full">
				<Container
					className={`grid grid-cols-1 gap-2 pb-4 place-items-center w-full overflow-hidden rounded-xl shadow-sm border`}
					css={{
						borderColor: "$subtleBorder",
						borderRadius: "12px",
						backgroundColor: "$surfaceOnSurface",
					}}
				>
					{props.children}
				</Container>
			</a>
		</Link>
	);
};

NFTCard.Detail = DetailSection;
NFTCard.Actions = ActionSection;
NFTCard.Wishlist = WishlistSection;
NFTCard.OwnerUtils = OwnershipSection;
NFTCard.Creator = CreatorTag;
NFTCard.Protected = ProtectedTag;
NFTCard.Media = MediaContainer;
NFTCard.Price = Price;
NFTCard.ListedBy = ListedBy;
NFTCard.Collection = Collection;
NFTCard.MarketStatus = MarketType;
NFTCard.SoldOut = SoldOutTag;
