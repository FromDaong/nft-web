import CollectionNFTPreview from "@components/NFTCard/cards/CollectionNFTPreview";
import {FrostyBackgroundContainer} from "@components/NFTCard/misc/FrostyBackground";
import {
	CameraIcon,
	ExternalLinkIcon,
	PlusIcon,
	UserAddIcon,
} from "@heroicons/react/outline";
import {TritPost} from "@packages/post/TritPost";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import axios from "axios";
import TreatCore from "core/TreatCore";
import UserAvatar from "core/auth/components/Avatar";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";
import {useRouter} from "next/router";
import {useState} from "react";
import {toast} from "react-hot-toast";
import {useAccount} from "wagmi";

const useUpdateCoverPhoto = (type, id) => {
	const [isLoading, setIsLoading] = useState(false);

	const updateCoverPhoto = async (file: File) => {
		setIsLoading(true);
		const formData = new FormData();
		formData.append("cover_photo", file);
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3/${type}/${id}/patch?field=cover_image`,
				formData
			);
		} catch (e) {
			console.error(e);
			toast.error("Failed to update cover photo");
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		updateCoverPhoto,
	};
};

export default function CollectionPage() {
	const {address} = useAccount();
	const router = useRouter();
	const {collectionId} = router.query;

	// Fetch collection data from the API
	const {
		data: collection,
		isLoading,
		isError,
	} = TreatCore.useQuery(["collection", collectionId], async () => {
		const data = await axios.get(
			`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3/marketplace/collection/${collectionId}`
		);
		return data.data.data;
	});

	// Fetch NFTs in this collection
	const {
		data: nfts,
		isLoading: isLoadingNFTs,
		isError: isErrorNFTs,
	} = TreatCore.useQuery(["collection", collectionId, "nfts"], async () => {
		const data = await axios.get(
			`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3/marketplace/collection/${collectionId}/nfts`
		);
		return data.data.data;
	});

	const {isLoading: isLoadingCover, updateCoverPhoto} = useUpdateCoverPhoto(
		"collection",
		collectionId
	);

	const isOwner = address?.toLowerCase() === collection?.creator?.address;
	console.log({nfts});
	return (
		<ApplicationLayout>
			{!isLoading && !isError && (
				<Container
					css={{
						backgroundColor: "$textContrast",
						background: `url(${
							collection.cover_image ?? "/assets/bg.jpg"
						}) no-repeat center center / cover`,
					}}
					className="flex relative flex-col items-center justify-center gap-24 h-96"
				>
					{isLoadingCover && (
						<Container
							className="h-full w-full absolute top-0 left-0"
							css={{backgroundColor: "$overlay"}}
						/>
					)}
					{address?.toLowerCase() === collection?.creator?.address && (
						<form onSubmit={null}>
							<label
								className="cursor-pointer"
								htmlFor="cover_photo"
							>
								<FrostyBackgroundContainer
									css={{borderRadius: 999, padding: "1rem"}}
									className="items-center flex justify-center transition-all duration-200"
								>
									{!isLoadingCover ? (
										<CameraIcon className="w-8 h-8" />
									) : (
										<Text>
											<Spinner />
										</Text>
									)}
								</FrostyBackgroundContainer>
							</label>
							<input
								name={"cover_photo"}
								type="file"
								id="cover_photo"
								hidden
								onChange={(e) => updateCoverPhoto(e.target.files[0])}
							/>
						</form>
					)}
				</Container>
			)}
			<ApplicationFrame>
				{collection && (
					<Container className="py-4 flex flex-col gap-2 mt-4">
						<Container className="max-w-2xl">
							<Heading size={"md"}>{collection.name}</Heading>
						</Container>
						<Container className="flex items-center gap-4 p-2">
							<UserAvatar
								size={40}
								username={collection.creator?.username}
								profile_pic={collection.creator?.profile.profile_pic}
							/>
							<Link href={`/${collection.creator?.username}`}>
								<a className="flex flex-col">
									<Text css={{color: "$textContrast"}}>
										<ImportantText>
											{collection.creator?.profile?.display_name}{" "}
										</ImportantText>
									</Text>
									<Text>@{collection.creator?.username}</Text>
								</a>
							</Link>
						</Container>
					</Container>
				)}
				<Container className="flex justify-between gap-4 pt-8 mt-8 items-end">
					<Heading size={"xs"}>
						{isLoadingNFTs && !nfts && (
							<Container
								className="h-full w-96"
								css={{backgroundColor: "$surfaceOnSurface"}}
							/>
						)}
						{!!nfts && (
							<>NFTs ({Intl.NumberFormat().format(nfts.docs.length)})</>
						)}
					</Heading>
					<Link href={`/create/${collectionId}`}>
						<a>
							<Button appearance={"surface"}>
								<PlusIcon className="w-5 h-5" /> Add NFTs to collection
							</Button>
						</a>
					</Link>
				</Container>
				<Divider dir={"horizontal"} />
				{!isLoadingNFTs && !isErrorNFTs && (
					<Container
						className={
							"grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 py-8 gap-8"
						}
					>
						{nfts.docs.map((nft) => (
							<CollectionNFTPreview
								_id={nft._id}
								creator={{
									...nft.creator,
									profile: {
										_id: nft.creator?.profile,
									},
								}}
								name={nft.name}
								isMine={true}
								isProtected={nft.isProtected}
								key={nft.id}
							/>
						))}
					</Container>
				)}
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
