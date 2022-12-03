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
import {
	ImportantText,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import {PostCardAction} from "./blocks";
import {DotsHorizontalIcon, EyeOffIcon} from "@heroicons/react/outline";
import {PostMediaContent} from "./PostMediaContent";
import Avatar from "@packages/shared/components/AvatarNew";
import UserAvatar from "core/auth/components/Avatar";
import {CardOverlay} from "@packages/shared/components/Card/MarketingPages/BenefitsCard";
import {styled} from "@styles/theme";

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
				<FrostyBackgroundContainer className="rounded-full py-2 pl-2 pr-4 flex gap-2 ">
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
	const imageUrl = props.image?.cdn;

	return (
		<Link href={`/post/${props.id}`}>
			<a>
				<Container
					className="flex border shadow relative overflow-hidden"
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
						className="w-full h-full p-8 flex flex-col justify-between"
						css={{zIndex: 10}}
					>
						<Container className="flex justify-between">
							<FrostyBackgroundContainer
								css={{borderRadius: "calc(8px + 16px)", padding: "8px"}}
							>
								<Container
									css={{
										height: "80px",
										width: "80px",
										backgroundImage:
											"url('https://f8n-production.imgix.net/collections/gl58ysacv.gif?q=45&w=96&h=96&fit=crop&dpr=2')",
										borderRadius: "calc(16px)",
									}}
								/>
							</FrostyBackgroundContainer>
							<Container>
								<FrostyBackgroundContainer
									className="py-1 px-3 rounded-full"
									css={{}}
								>
									{props.totm && (
										<Text css={{color: "#ffffff"}}>
											<ImportantText>TOTM</ImportantText>
										</Text>
									)}

									{props.protected ||
										(!imageUrl && (
											<Container className="flex gap-2 items-center justify-center">
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

									{props.collection.minted === props.collection.totalSupply && (
										<Container className="flex gap-2 items-center justify-center">
											<Text css={{color: "#ffffff"}}>
												<ImportantText>Sold out</ImportantText>
											</Text>
										</Container>
									)}
								</FrostyBackgroundContainer>
							</Container>
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
								<FrostyBackgroundContainer className="rounded-full py-2 px-4">
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
