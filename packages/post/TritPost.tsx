import {Text} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";
import {Container} from "@packages/shared/components/Container";
import {TritPostProps} from "./types";
import {
	ImportantText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {EyeOffIcon} from "@heroicons/react/outline";
import {PostMediaContent} from "./PostMediaContent";
import {styled} from "@styles/theme";
import {useTritNFTUtils} from "./hooks";
import {ActionSection} from "./UtilityComponents";
import {useInView} from "react-intersection-observer";

export const FrostyBackgroundContainer = styled(Container, {
	backgroundColor: "#00000033",
	backdropFilter: "blur(10px)",

	variants: {
		appearance: {
			danger: {
				backgroundColor: "Red",
			},
			invert: {
				backgroundColor: "$surface",
			},
		},
	},
});

// T-84 Sold out status should come from the subgraph
export const TritPost = (props: TritPostProps) => {
	const {ref} = useInView();
	const {liked, likeNFT, isMine, isProtected, loadingSigner} =
		useTritNFTUtils(props);

	const soldOut = props.collection?.minted === props.max_supply;

	return (
		<Link href={`/post/nft/${props._id}`}>
			<a className="relative flex flex-col w-full">
				<Container
					ref={ref}
					className={`grid grid-cols-1 gap-4 pb-4 place-items-center w-full overflow-hidden rounded-xl shadow-sm border`}
					css={{
						borderColor: "$subtleBorder",
						borderRadius: "12px",
						backgroundColor: "$surfaceOnSurface",
					}}
				>
					<Container className="relative flex w-full overflow-hidden aspect-square">
						{!loadingSigner && 0 === 0 && !props.hideSoldOut && (
							<Text
								css={{
									color: "$surface",
									backgroundColor: "$red9",
									transform: "rotate(-45deg)",
									top: "16px",
									left: "-24px",
								}}
								className="absolute px-8 h-fit w-fit"
							>
								<SmallText>
									<ImportantText>Sold Out</ImportantText>
								</SmallText>
							</Text>
						)}
						<PostMediaContent
							isProtected={isProtected && !isMine}
							caption={props.text}
							_id={props._id}
						/>
						<Container
							className="flex flex-col justify-between w-full h-full p-4"
							css={{zIndex: 10}}
						>
							<Container className="flex items-center justify-between">
								<Container className="flex gap-4">
									{(isProtected || soldOut || props.totm) && (
										<Container className="flex justify-between w-full">
											{isProtected && (
												<FrostyBackgroundContainer
													className="px-3 py-1 rounded-full"
													css={{}}
												>
													{isProtected && (
														<Container className="flex items-center justify-center gap-2">
															<Text css={{color: "#ffffff"}}>
																<EyeOffIcon
																	width={20}
																	height={20}
																/>
															</Text>
															<Text css={{color: "#ffffff"}}>
																<ImportantText>Protected</ImportantText>
															</Text>
														</Container>
													)}
												</FrostyBackgroundContainer>
											)}
										</Container>
									)}
								</Container>
								<CreatorTag
									avatar={props.creator.username}
									username={props.creator.username}
								/>
							</Container>
						</Container>
					</Container>
					<Container className="flex flex-col w-full px-4">
						<ActionSection
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
							soldOut={props.isSoldOut}
						/>
					</Container>
				</Container>
			</a>
		</Link>
	);
};

TritPost.DetailSection = ActionSection;

function CreatorTag({avatar, username}) {
	return (
		<Link href={`/${username}`}>
			<a>
				<FrostyBackgroundContainer className="flex items-center gap-2 p-2 rounded-full">
					<img
						src={avatar}
						className="w-6 h-6 overflow-hidden rounded-full"
					/>
					<Text
						css={{
							color: "$white",
						}}
					>
						<ImportantText>@{username}</ImportantText>
					</Text>
				</FrostyBackgroundContainer>
			</a>
		</Link>
	);
}
