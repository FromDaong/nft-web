import {connectMongoDB} from "@db/engine";
import LegacyNFTModel from "@db/legacy/nft/NFT";
import ModelTransaction from "@db/models/transaction";
import Error404 from "@packages/error/404";
import {useDisclosure} from "@packages/hooks";
import FullScreenImagePreview from "@packages/modals/FullScreenImagePreview";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import OptimizedImage from "@packages/shared/components/OptimizedImage";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
} from "@packages/shared/components/Typography/Text";
import {timeFromNow} from "@utils/index";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";

export default function NFT(props: {notFound?: boolean; data: any}) {
	const {
		isOpen: isFullscreenPreviewOpen,
		onOpen: onOpenFullscreenPreview,
		onClose: onCloseFullscreenPreview,
	} = useDisclosure();

	if (props.notFound) {
		return <Error404 />;
	}

	const data = JSON.parse(props.data);
	const {nft, mints} = data;

	console.log({mints});

	return (
		<>
			<FullScreenImagePreview
				isOpen={isFullscreenPreviewOpen}
				onClose={onCloseFullscreenPreview}
				imageUrl={nft.image}
				alt={nft.name}
			/>
			<Container
				className="w-full 2xl:h-[80vh] lg:h-[90vh] h-[calc(100vh-64px)] flex items-center justify-center"
				css={{backgroundColor: "$surfaceOnSurface"}}
			>
				<Container className="flex-1 h-full py-32 max-w-7xl">
					<Container
						className="relative w-full h-full"
						onClick={onOpenFullscreenPreview}
					>
						<OptimizedImage
							src={nft.image}
							className="cursor-zoom-in"
							sizes="100vw"
							fill
							objectFit="contain"
							alt={nft.name}
						/>
					</Container>
				</Container>
			</Container>
			<ApplicationLayout>
				<ApplicationFrame>
					<Container className="grid grid-cols-1 gap-8 px-4 lg:grid-cols-2 xl:px-0">
						<Container className="flex flex-col gap-12 py-8">
							<Container className="flex flex-col gap-4">
								<MutedText>
									<ImportantText>
										Remaining: {nft.max_supply - (nft.mints?.length ?? 0)} /{" "}
										{nft.max_supply}
									</ImportantText>
								</MutedText>
								<Heading size="sm">{nft.name}</Heading>
								<Link href={`/${nft.model_handle}`}>
									<a>
										<Container className="flex">
											<Container
												className="flex items-center gap-2 px-4 py-2 border rounded-full"
												css={{
													borderColor: "$subtleBorder",
													backgroundColor: "$surfaceOnSurface",
												}}
											>
												<UserAvatar
													value={nft.model_handle}
													size={24}
												/>
												<Text>
													<ImportantText>@{nft.model_handle}</ImportantText>
												</Text>
											</Container>
										</Container>
									</a>
								</Link>
							</Container>
							<Container className="flex flex-col gap-4">
								<Heading size="xs">Description</Heading>
								<Text>{nft.description}</Text>
							</Container>
						</Container>
						<Container className="flex flex-col gap-12 py-8">
							<Container
								className="p-4 border"
								css={{borderColor: "$subtleBorder", borderRadius: "16px"}}
							>
								<Container className="flex flex-col gap-8">
									<Container className="flex flex-col gap-1">
										<Text>
											<MutedText>List price</MutedText>
										</Text>
										<Heading size="md">{nft.list_price} BNB</Heading>
									</Container>
									<Container>
										{nft.mints?.length === Number(nft.max_supply) ? (
											<Button
												fullWidth
												appearance={"subtle"}
												disabled
											>
												Sold out
											</Button>
										) : (
											<Button fullWidth>Buy now</Button>
										)}
									</Container>
								</Container>
							</Container>
							<Container className="flex flex-col gap-4">
								<Heading size="xs">Purchase history</Heading>
								<Container className="grid grid-cols-1 gap-6">
									{mints.map((tx) => (
										<Link
											key={tx.txHash}
											href={`https://bscscan.com/tx/${tx.txHash}`}
										>
											<a>
												<Container className="flex gap-2">
													<UserAvatar
														value={tx.metadata.balanceSender}
														size={24}
													/>
													<Container className="flex flex-col gap-1">
														<Text>
															<ImportantText>
																{tx.metadata.balanceSender} purchased for{" "}
																{tx.amount} BNB
															</ImportantText>
														</Text>
														<MutedText>{timeFromNow(tx.timestamp)}</MutedText>
													</Container>
												</Container>
											</a>
										</Link>
									))}
								</Container>
							</Container>
						</Container>
					</Container>
				</ApplicationFrame>
			</ApplicationLayout>
		</>
	);
}

export const getServerSideProps = async (context) => {
	const {id} = context.params;

	await connectMongoDB();

	const nft = await LegacyNFTModel.findOne({id});

	if (!nft) {
		return {
			notFound: true,
		};
	}

	const transactions = await ModelTransaction.find({
		"metadata.nftId": id,
	});

	const returnObj = {
		id,
		mints: transactions,
		nft: nft,
	};

	return {
		props: {
			data: JSON.stringify(returnObj),
		},
	};
};
