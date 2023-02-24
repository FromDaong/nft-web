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
import {useEffect, useState} from "react";
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

export const TritPost = (props: TritPostProps) => {
	const {ref} = useInView();
	const {liked, likeNFT, isMine, isProtected, loadingSigner, remainingNfts} =
		useTritNFTUtils(props);

	const [imageURL, setImageURL] = useState("");

	const soldOut = props.collection?.minted === props.max_supply;

	const ipfs_parts = props.image?.ipfs.split("/");
	const ipfs_id = ipfs_parts[ipfs_parts.length - 1];
	const blurred_image = `${ipfs_id}?blurhash=true`;
	const sd_image = `${ipfs_id}?`;

	useEffect(() => {
		if (props.protected && !isMine) {
			setImageURL(blurred_image);
			return;
		}

		setImageURL(sd_image);
	}, [props.protected, isMine]);

	return (
		<Link href={`/post/nft/${props._id}`}>
			<a className="relative flex flex-col w-full overflow-hidden">
				<Container
					ref={ref}
					className={`grid grid-cols-1 gap-4 py-4 place-items-center w-full`}
					css={{
						borderColor: "$subtleBorder",
						borderRadius: "12px",
					}}
				>
					<Container
						className="relative w-full flex overflow-hidden rounded-xl"
						css={{
							height: "256px",
						}}
					>
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
							imageUrl={imageURL}
							blurhash={props.blurhash}
							isProtected={isProtected}
							caption={props.text}
							overrideText={
								"The creator wants you to collect this NFT before you can preview the content"
							}
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
							</Container>
						</Container>
					</Container>
					<Container className="flex flex-col w-full">
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
						/>
					</Container>
				</Container>
			</a>
		</Link>
	);
};
