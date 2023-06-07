import {Container} from "@packages/shared/components/Container";
import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {NFTCard} from "..";

export default function PortfolioPublicListingCard(props: TritPostProps) {
	const {liked, likeNFT, isMine, isProtected} = useTritNFTUtils(props);

	const soldOut = props.collection?.minted === props.max_supply;
	const editions = new Array(+props.count).fill(0).map((_, i) => i + 1);
	return (
		<NFTCard _id={props._id}>
			<Container className="relative shadow">
				<Container
					className="relative"
					css={{zIndex: 1}}
				>
					<NFTCard.RenderMedia
						isProtected={isProtected}
						isMine={isMine}
						text={props.text}
						_id={props._id}
					/>
				</Container>
				{editions.slice(0, 3).map((_, i) => (
					<Container
						key={i}
						className="absolute rounded-xl top-0 right-0 border shadow"
						css={{
							width: `${100 - (i + 1) * 10}%`,
							height: "100%",
							top: `${(i + 1) * 1.25}%`,
							borderColor: "$border",
							left: "50%",
							transform: "translateX(-50%)",
							zIndex: -i,
							backgroundColor: "$surface",
						}}
					/>
				))}
			</Container>

			<Container
				className={`flex flex-col w-full gap-2 mt-4`}
				css={{
					marginTop: "1rem !important",
				}}
			>
				<NFTCard.Detail
					{...props}
					isMine={isMine}
					liked={liked}
					likeNFT={likeNFT}
					unlikeNFT={likeNFT}
					creator={props.creator.username}
					toggleImageProtection={() => null}
					isProtected={isProtected}
					hideSeller={props.hideSeller}
					count={props.count}
					soldOut={soldOut}
				/>
			</Container>
		</NFTCard>
	);
}
