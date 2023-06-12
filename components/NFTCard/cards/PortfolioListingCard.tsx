import {Container} from "@packages/shared/components/Container";
import {useTritNFTUtils} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {NFTCard} from "..";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {Button} from "@packages/shared/components/Button";
import {EnterFullScreenIcon} from "@radix-ui/react-icons";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {ArrowRight, ShoppingBag} from "lucide-react";
import {FrostyBackgroundContainer} from "../misc/FrostyBackground";
import {useRef} from "react";
import FullscreenImagePreviewModal from "@packages/modals/ImagePreview";
import {useDisclosure} from "@packages/hooks";
import Link from "next/link";

export default function PortfolioPublicListingCard(
	props: TritPostProps & {overrideOwnership?: boolean}
) {
	const {
		isOpen: isLightboxOpen,
		onOpen: onLightboxOpen,
		onClose: onLightboxClose,
	} = useDisclosure();
	const {isMine: chainIsMine, isProtected} = useTritNFTUtils(props);

	const isMine = props.overrideOwnership ?? (chainIsMine || props.count > 0);
	const editions = new Array(+props.count).fill(0).map((_, i) => i + 1);

	return (
		<NFTCard _id={props._id}>
			<Container className="relative">
				<Container
					className="absolute top-0 right-0 p-4"
					css={{
						zIndex: 5,
					}}
				>
					<FrostyBackgroundContainer
						css={{
							height: "2.2rem",
							width: "2.2rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: 999,
						}}
						className="shadow-xl"
					>
						<Text
							css={{
								color: "$white",
							}}
						>
							<ImportantText>{props.count}</ImportantText>
						</Text>
					</FrostyBackgroundContainer>
				</Container>
				<Container
					className="relative shadow cursor-pointer rounded-xl overflow-clip group"
					css={{zIndex: 4}}
				>
					<NFTCard.RenderMedia
						isProtected={isProtected && !isMine}
						isMine={isMine}
						text={props.text}
						_id={props._id}
					/>
					<Container
						className="absolute top-0 left-0 flex-col items-center justify-end hidden w-full h-full gap-4 p-4 pb-8 text-center transition-opacity duration-300 group-hover:flex"
						css={{
							zIndex: 10,
							background:
								"linear-gradient(180deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.525208) 57.08%, rgba(0, 0, 0, 0.85) 100%)",
						}}
					>
						<Container className="flex flex-col items-center gap-2">
							<NFTCard.Creator
								avatar={props.creator.avatar}
								username={props.creator.username}
							/>
							<Heading
								css={{color: "$white"}}
								size={"xs"}
							>
								{props.name}
							</Heading>
						</Container>
						<Text css={{color: "$sand2"}}>{props.text}</Text>
						{isMine && (
							<>
								{isLightboxOpen && (
									<FullscreenImagePreviewModal
										isOpen={isLightboxOpen}
										onClose={onLightboxClose}
										url={`/api/v3/image/nft/${props._id}/hd`}
										title={props.name}
									/>
								)}
								<Button
									className="w-fit"
									appearance={"surface"}
									css={{borderRadius: 999}}
									onClick={onLightboxOpen}
								>
									<EnterFullScreenIcon className="w-4 h-4" />
									View in fullscreen
								</Button>
							</>
						)}
						{!isMine && (
							<Link href={`/post/nft/${props._id}`}>
								<a>
									<Button
										className="w-fit"
										appearance={"surface"}
										css={{borderRadius: 999}}
									>
										<ShoppingBag className="w-4 h-4" />
										Buy on sweetshop
										<ArrowRight className="w-4 h-4" />
									</Button>
								</a>
							</Link>
						)}
					</Container>
				</Container>
				{editions.slice(0, 3).map((_, i) => (
					<Container
						key={i}
						className="absolute top-0 right-0 border shadow rounded-xl"
						css={{
							width: i < 3 ? `${100 - (i + 1) * 10}%` : `100%`,
							height: "100%",
							top: i < 3 ? `${(i + 1) * 1.5}%` : 0,
							borderColor: "$border",
							left: i < 3 ? "50%" : 0,
							transform:
								i < 3
									? "translateX(-50%)"
									: `rotate(${i % 2 === 0 ? "-" : ""}${i}deg)`,
							zIndex: 3 - i,
							backgroundColor: "$surface",
						}}
					/>
				))}
			</Container>
		</NFTCard>
	);
}
