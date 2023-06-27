import {Container} from "@packages/shared/components/Container";
import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {NFTCard} from "..";
import Link from "next/link";
import {useRouter} from "next/router";
import {memo} from "react";

function SweetshopNFT(props: TritPostProps) {
	const {liked, likeNFT, isMine, isProtected} = useTritNFTUtils(props);

	const router = useRouter();
	const market = router.query.tab;
	const soldOut = props.collection?.minted === props.max_supply;

	return (
		<Link
			href={`/post/nft/${props._id}?seller=${props.seller.address}&id=${
				props.id
			}${market ? `&market=${market}` : ""}`}
		>
			<a>
				<NFTCard _id={props._id}>
					<Container className="relative w-full overflow-hidden aspect-[11/16] group">
						<NFTCard.Media
							isProtected={isProtected}
							caption={props.text}
							_id={props._id}
						/>

						<Container
							className="absolute top-0 left-0 flex flex-col justify-between w-full h-full p-2 rounded-lg"
							css={{
								zIndex: 10,
							}}
						>
							<Container className="flex flex-col items-start justify-between flex-1 p-2">
								<NFTCard.Creator
									avatar={props.creator.avatar}
									username={props.creator.username}
								/>
								{!isMine && (
									<Container>{isProtected && <NFTCard.Protected />}</Container>
								)}
							</Container>
						</Container>
					</Container>
					<Container className="flex flex-col w-full gap-2 pt-2">
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
							Price={NFTCard.Price}
							ListedBy={NFTCard.ListedBy}
						/>
					</Container>
				</NFTCard>
			</a>
		</Link>
	);
}

export default memo(SweetshopNFT);
