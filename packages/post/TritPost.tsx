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
	backgroundColor: "#ffffff33",
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
	const {liked, likeNFT, isMine, isProtected, loadingSigner, remainingNfts} =
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
						{!loadingSigner && remainingNfts === 0 && !props.hideSoldOut && (
							<Text
								css={{
									color: "$surface",
									backgroundColor: "$red9",
									transform: "rotate(-45deg)",
									top: "16px",
									left: "-24px",
								}}
								className="absolute z-10 px-8 h-fit w-fit"
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
									{false && (
										<FrostyBackgroundContainer
											css={{borderRadius: "calc(8px + 16px)", padding: "8px"}}
										>
											<Container
												css={{
													height: "80px",
													width: "80px",

													borderRadius: "calc(16px)",
												}}
											/>
										</FrostyBackgroundContainer>
									)}
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
											{soldOut && (
												<FrostyBackgroundContainer className="px-3 py-1 rounded-full">
													<Container className="flex items-center justify-center gap-2">
														<Text css={{color: "$red6"}}>
															<ImportantText>Sold out</ImportantText>
														</Text>
													</Container>
												</FrostyBackgroundContainer>
											)}
										</Container>
									)}
								</Container>
								<img
									src={props.author?.avatar}
									className="w-8 h-8 overflow-hidden bg-white rounded-full shadow"
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
							creator={props.author.username}
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
