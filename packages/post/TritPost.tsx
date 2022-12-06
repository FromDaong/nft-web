import BackgroundImage from "@packages/post/BackgroundImage";
import Blurhash from "@packages/post/Blurhash";
import {
	Heading,
	ImportantSmallText,
	Text,
} from "@packages/shared/components/Typography/Headings";
import Link from "next/link";
import {Container} from "@packages/shared/components/Container";
import {TPost} from "./types";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {EyeOffIcon} from "@heroicons/react/outline";
import {PostMediaContent} from "./PostMediaContent";
import UserAvatar from "core/auth/components/Avatar";
import {CardOverlay} from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import {styled} from "@styles/theme";
import ContentLoader from "react-content-loader";

export const StyledLoader = styled(ContentLoader, {
	backgroundColor: "$surface",
	foreGroundColor: "$elementOnSurface",
});

export const SkeletonTritCollectiblePost = (props) => (
	<StyledLoader
		speed={1}
		width={320}
		height={400}
		viewBox="0 0 320 400"
		{...props}
	>
		<rect
			x="39"
			y="26"
			rx="2"
			ry="2"
			width="58"
			height="57"
		/>
		<rect
			x="34"
			y="332"
			rx="9"
			ry="9"
			width="262"
			height="9"
		/>
		<rect
			x="33"
			y="356"
			rx="14"
			ry="14"
			width="93"
			height="30"
		/>
		<rect
			x="207"
			y="355"
			rx="14"
			ry="14"
			width="93"
			height="30"
		/>
		<rect
			x="37"
			y="313"
			rx="2"
			ry="2"
			width="92"
			height="8"
		/>
		<rect
			x="200"
			y="312"
			rx="2"
			ry="2"
			width="92"
			height="8"
		/>
		<rect
			x="41"
			y="105"
			rx="0"
			ry="0"
			width="255"
			height="186"
		/>
	</StyledLoader>
);

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

export const UserBadge = (props: {username: string; avatar: string}) => {
	return (
		<Link href={`/${props.username}`}>
			<a>
				<FrostyBackgroundContainer className="flex gap-2 py-2 pl-2 pr-4 rounded-full ">
					<UserAvatar
						size={24}
						value={props.username}
					/>
					<Text css={{color: "#ffffff"}}>
						<ImportantText>@{props.username}</ImportantText>
					</Text>
				</FrostyBackgroundContainer>
			</a>
		</Link>
	);
};

export const TritPost = (props: TPost) => {
	const imageUrl = props.image?.cdn ?? props.image?.ipfs;

	return (
		<Link href={`/post/nft/${props.id}`}>
			<a>
				<Container
					className="relative flex overflow-hidden border shadow"
					css={{
						borderColor: "$subtleBorder",
						borderRadius: "16px",
						backgroundColor: "$surface",
						height: "440px",
					}}
				>
					<CardOverlay />
					<PostMediaContent
						imageUrl={imageUrl}
						blurhash={props.blurhash}
						caption={props.text}
						overrideText={
							"The creator wants you to collect this trit before you can preview the content"
						}
					/>
					<Container
						className="flex flex-col justify-between w-full h-full p-8"
						css={{zIndex: 10}}
					>
						<Container className="flex justify-between">
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
							{props.protected ||
								props.collection.minted === props.collection.totalSupply ||
								(props.totm && (
									<Container>
										<FrostyBackgroundContainer
											className="px-3 py-1 rounded-full"
											css={{}}
										>
											{props.totm && (
												<Text css={{color: "#ffffff"}}>
													<ImportantText>TOTM</ImportantText>
												</Text>
											)}

											{props.protected ||
												(!imageUrl && (
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
												))}

											{props.collection.minted ===
												props.collection.totalSupply && (
												<Container className="flex items-center justify-center gap-2">
													<Text css={{color: "#ffffff"}}>
														<ImportantText>Sold out</ImportantText>
													</Text>
												</Container>
											)}
										</FrostyBackgroundContainer>
									</Container>
								))}
						</Container>
						<Container className="flex flex-col gap-4">
							<Heading
								css={{color: "#ffffff"}}
								size="sm"
							>
								{props.collection.name}
							</Heading>
							<Container className="flex flex-col gap-2">
								<Container className="flex justify-between">
									<Text css={{color: "#ffffff"}}>Supply</Text>
									<Text css={{color: "#ffffff"}}>
										{props.collection.minted}/{props.collection.totalSupply}
									</Text>
								</Container>
								<FrostyBackgroundContainer
									className="rounded-full"
									css={{height: "10px"}}
								>
									<Container
										className="rounded-full"
										css={{
											backgroundColor: "$surfaceOnSurface",
											width: `${
												(props.collection.minted /
													props.collection.totalSupply) *
												100
											}%`,
											height: "100%",
										}}
									/>
								</FrostyBackgroundContainer>
							</Container>
							<Container className="flex justify-between">
								<UserBadge
									username={props.author.username}
									avatar={props.author.avatar}
								/>
								<FrostyBackgroundContainer className="px-4 py-2 rounded-full">
									<Text css={{color: "#ffffff"}}>
										<ImportantText>
											{props.price.value} {props.price.currency}
										</ImportantText>
									</Text>
								</FrostyBackgroundContainer>
							</Container>
						</Container>
					</Container>
				</Container>
			</a>
		</Link>
	);
};
