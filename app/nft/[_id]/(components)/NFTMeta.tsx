import {Container} from "@packages/shared/components/Container";

const NFTMeta = () => {
	const {event} = data;
	const {isOwned, balance} = useGetIsNFTOwned(nft);

	const isResale =
		event && event.seller.toLowerCase() !== nft.creator.address.toLowerCase();

	return (
		<Container className="flex flex-wrap gap-4 px-8">
			{isOwned && balance > 0 && (
				<Container className="flex mt-8">
					<Container
						className="flex items-center gap-4 px-8 py-4"
						css={{
							backgroundColor: "$accentBg",
							borderRadius: "16px",
						}}
					>
						<Container>
							<Text css={{color: "$accentText"}}>
								<RectangleStack
									width={32}
									height={32}
								/>
							</Text>
						</Container>
						<Container>
							<Heading
								css={{color: "$accentText"}}
								size="xss"
							>
								You own this NFT
							</Heading>
							<Text css={{color: "$accentText"}}>
								<SmallText>
									You already own {balance} units of this NFT
								</SmallText>
							</Text>
						</Container>
					</Container>
				</Container>
			)}
			{isResale && (
				<Container className="flex mt-8">
					<Container
						className="flex items-center gap-4 px-8 py-4"
						css={{
							backgroundColor: "$amber3",
							borderRadius: "16px",
						}}
					>
						<Container>
							<Text css={{color: "$amber7"}}>
								<RectangleStack
									width={32}
									height={32}
								/>
							</Text>
						</Container>
						<Container>
							<Heading
								css={{color: "$amber12"}}
								size="xss"
							>
								Resale Market
							</Heading>
							<Text css={{color: "$amber11"}}>
								<SmallText>NFT listed on Resale Market</SmallText>
							</Text>
						</Container>
					</Container>
				</Container>
			)}
			{address &&
				nft.creator.profile.address.toLowerCase() ===
					address?.toLowerCase() && (
					<Container className="flex mt-8">
						<Container
							className="flex items-center gap-4 px-8 py-4"
							css={{
								backgroundColor: "$pink3",
								borderRadius: "16px",
							}}
						>
							<Container>
								<Text css={{color: "$pink7"}}>
									<ImageIcon
										width={32}
										height={32}
									/>
								</Text>
							</Container>
							<Container>
								<Heading
									css={{color: "$pink12"}}
									size="xss"
								>
									Your masterpiece
								</Heading>
								<Text css={{color: "$pink12"}}>
									<SmallText>You are the creator of this NFT</SmallText>
								</Text>
							</Container>
						</Container>
					</Container>
				)}
		</Container>
	);
};

export default NFTMeta;
