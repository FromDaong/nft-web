import PortfolioPublicListingCard from "@components/NFTCard/cards/PortfolioListingCard";
import GenericChainModal from "@packages/modals/GenericChainModal";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {useUser} from "core/auth/useUser";
import Link from "next/link";
import {useRouter} from "next/router";

export default function PurchasedNFTPreview({isOpen, nft}) {
	const {profile} = useUser();
	const router = useRouter();

	return (
		<GenericChainModal
			isOpen={isOpen}
			title={""}
			subtitle={""}
			hideClose
			noButton
			onClose={router.reload}
		>
			<Container className="flex flex-col gap-4 py-4">
				<Container className="flex justify-center max-w-[320px] mx-auto w-full">
					<PortfolioPublicListingCard
						{...nft}
						count={1}
						overrideOwnership={true}
					/>
				</Container>
				<Container className="flex justify-between mt-4">
					<Button
						onClick={router.reload}
						appearance={"surface"}
					>
						Close
					</Button>
					<Link href={`/${profile?.username}/portfolio`}>
						<a>
							<Button appearance={"action"}>View in my portfolio</Button>
						</a>
					</Link>
				</Container>
			</Container>
		</GenericChainModal>
	);
}
