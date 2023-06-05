import {Container} from "@packages/shared/components/Container";
import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {NFTCard} from "..";
import Link from "next/link";
import {useRouter} from "next/router";

export default function SweetshopNFT(props: TritPostProps) {
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
					<Container className="relative w-full overflow-hidden aspect-square">
						<NFTCard.Media
							isProtected={isProtected && !isMine}
							caption={props.text}
							_id={props._id}
						/>

						<Container
							className="absolute flex flex-col justify-between w-full p-2 top-2 left-2 h-fit"
							css={{zIndex: 10}}
						>
							<Container className="flex items-center justify-between">
								<Container>{isProtected && <NFTCard.Protected />}</Container>
								<NFTCard.Creator
									avatar={props.creator.avatar}
									username={props.creator.username}
								/>
							</Container>
						</Container>
					</Container>
					<Container className="flex flex-col w-full gap-2 mt-2">
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
