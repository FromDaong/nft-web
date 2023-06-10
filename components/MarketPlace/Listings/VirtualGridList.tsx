import {styled} from "@styles/theme";
import {MutableRefObject} from "react";
import {VirtuosoGrid} from "react-virtuoso";

const NFTListContainer = styled("div", {
	flexWrap: "wrap",
	display: "grid",
	gap: "2rem",
	gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
	maxWidth: "100%",
	marginX: "auto",
	"@media (min-width: 768px)": {
		gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
	},
	"@media (min-width: 1024px)": {
		gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
	},
	"@media (min-width: 1280px)": {
		gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
		maxWidth: 1280,
	},
	"@media (min-width: 1536px)": {
		gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
	},
});

const ItemWrapper = styled("div", {
	flex: 1,
	textAlign: "center",
	padding: "1rem",
	whiteSpace: "nowrap",
});

const NFTItemContainer = styled("div", {
	gridColumn: "span 1 / span 1",
	display: "flex",
	flexDirection: "column",
	padding: "0 0.5rem",
	"@md": {
		width: 0.5,
	},
	"@sm": {
		width: "100%",
	},
});

export default function MarketplaceListingResults({
	data,
	fetchNext,
	hasNextPage,
	scrollerRef,
	Component,
}: {
	data: any[];
	fetchNext: () => void;
	hasNextPage: boolean;
	scrollerRef: MutableRefObject<HTMLElement>;
	Component: (props: any) => JSX.Element;
}) {
	const getNextPage = () => {
		if (hasNextPage) fetchNext();
	};
	return (
		<>
			<VirtuosoGrid
				className="w-full py-8"
				useWindowScroll
				totalCount={data.length}
				overscan={24}
				endReached={getNextPage}
				customScrollParent={scrollerRef.current}
				components={{
					// Header: Header,
					Item: NFTItemContainer,
					List: NFTListContainer,
					ScrollSeekPlaceholder: ({height, width, index}) => (
						<NFTItemContainer>
							<ItemWrapper>{"--"}</ItemWrapper>
						</NFTItemContainer>
					),
				}}
				itemContent={(index) => {
					const nft = data[index];
					return (
						<Component
							inGrid
							{...nft}
						/>
					);
				}}
			/>
		</>
	);
}
