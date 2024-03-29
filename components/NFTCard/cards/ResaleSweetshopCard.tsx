import {Container} from "@packages/shared/components/Container";
import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {NFTCard} from "..";
import Link from "next/link";
import {useRouter} from "next/router";
import {memo} from "react";
import {Button} from "@packages/shared/components/Button";
import {ExclamationCircleIcon} from "@heroicons/react/outline";
import {useUser} from "core/auth/useUser";
import {MinusCircle} from "lucide-react";
import {useDisclosure} from "@packages/hooks";
import RemoveListingModal from "@packages/modals/RemoveListingModal";

function ResaleSweetshopNFT(props: TritPostProps) {
	const {liked, likeNFT, isMine, isProtected} = useTritNFTUtils(props);
	const {profile} = useUser();

	const router = useRouter();
	const market = router.query.tab;
	const soldOut = props.collection?.minted === props.max_supply;

	const {isOpen, onOpen, onClose} = useDisclosure();

	const onClickRemove = (e) => {
		e.preventDefault();
		e.stopPropagation();
		onOpen();
	};
	return (
		<Link
			href={`/post/nft/${props._id}?seller=${props.seller.address}&id=${
				props.id
			}${market ? `&market=${market}` : ""}`}
		>
			<a>
				{isOpen && (
					<RemoveListingModal
						isOpen={isOpen}
						onClose={onClose}
						nft={props}
					/>
				)}
				<NFTCard _id={props._id}>
					<Container className="relative w-full overflow-hidden aspect-[11/16]">
						<NFTCard.Media
							isProtected={isProtected}
							caption={props.text}
							_id={props._id}
						/>

						<Container
							className="absolute top-0 left-0 flex flex-col justify-between w-full p-2 h-full rounded-lg"
							css={{
								zIndex: 10,
							}}
						>
							<Container className="flex flex-col flex-1 p-2 items-start justify-between">
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
						{profile?.address === props.seller.address && (
							<Button
								onClick={onClickRemove}
								appearance={"danger"}
							>
								<MinusCircle className="w-4 h-4" />
								Remove listing
							</Button>
						)}
					</Container>
				</NFTCard>
			</a>
		</Link>
	);
}

export default memo(ResaleSweetshopNFT);
