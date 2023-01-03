import {Text} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";
import {Container} from "@packages/shared/components/Container";
import {TritPostProps} from "./types";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {EyeOffIcon} from "@heroicons/react/outline";
import {PostMediaContent} from "./PostMediaContent";
import {styled} from "@styles/theme";
import {useTritNFTUtils} from "./hooks";
import {ActionSection} from "./UtilityComponents";
import {useEffect, useState} from "react";

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
	const {liked, likeNFT, isMine, isProtected, toggleImageProtection} =
		useTritNFTUtils(props);

	const [imageURL, setImageURL] = useState("");

	const soldOut = props.collection?.minted === props.max_supply;

	// T-28 check if user owns this nft and get the units owned

	// T-42 Add hover card with nft details including, original cretor listing tag, current owner, price, units owned, etc

	// T-43 Check if seller === creator , determine if resale or original listing
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
		<Container
			className={`grid grid-cols-1 gap-4 py-4 place-items-center w-full`}
			css={{
				borderColor: "$subtleBorder",
				borderRadius: "12px",
			}}
		>
			<Link
				href={`/post/nft/${props._id}${
					props.seller
						? `?seller=${props.seller.address}&eid=${props.seller.event_id}`
						: ""
				}`}
			>
				<a className="flex flex-col w-full">
					{
						// T-29 implement a hover options button if user owns this NFT
					}
					<Container
						className="relative flex overflow-hidden"
						css={{
							backgroundColor: "$textContrast",
							height: "256px",
							borderRadius: "12px",
							backdropFilter: isProtected ? "blur(10px)" : "none",
						}}
					>
						<PostMediaContent
							imageUrl={imageURL}
							blurhash={props.blurhash}
							isProtected={isProtected}
							caption={props.text}
							overrideText={
								"The creator wants you to collect this trit before you can preview the content"
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
				</a>
			</Link>
			<Container className="flex flex-col w-full transition-transform duration-150 hover:scale-95">
				<ActionSection
					{...props}
					isMine={isMine}
					liked={liked}
					likeNFT={likeNFT}
					unlikeNFT={likeNFT}
					creator={props.author.username}
					toggleImageProtection={toggleImageProtection}
					isProtected={isProtected}
					hideSeller={props.hideSeller}
				/>
			</Container>
		</Container>
	);
};
