import {TritResalePostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Heading, Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {ABI} from "@packages/treat/lib/abi";
import {contractAddresses} from "@packages/treat/lib/constants";
import {useUser} from "core/auth/useUser";
import {ethers} from "ethers";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {useAccount, useContract, useSigner, useWaitForTransaction} from "wagmi";
import GenericChainModal from "./GenericChainModal";

export const usePurchaseResaleOrder = (signer) => {
	const {address} = useAccount();

	const treatMarketplaceContract = useContract({
		addressOrName: contractAddresses.treatMarketplace[56],
		contractInterface: ABI.treatMarketplace,
		signerOrProvider: signer,
	});

	const purchaseResaleOrder = useCallback(
		async (id: number, amount: number, totalPrice, seller: string) => {
			return treatMarketplaceContract.purchase(id, 1, seller, {
				from: address,
				value: ethers.utils.parseEther(`${totalPrice}`),
			});
		},
		[address, treatMarketplaceContract]
	);

	return {purchaseResaleOrder};
};

export default function PurchaseNFTModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritResalePostProps;
}) {
	const router = useRouter();
	const {data: signer} = useSigner();
	const {profile} = useUser();
	const [amount] = useState(1);
	const [purchaseNFTPending, setPurchaseNFTPending] = useState(false);
	const [purchaseNFTSuccess, setPurchaseNFTSuccess] = useState(false);
	const [purchaseNFTError, setPurchaseNFTError] = useState<any>(false);
	const [tx, setTx] = useState("");

	const {isError, data, isSuccess} = useWaitForTransaction({
		hash: tx,
	});

	const {purchaseResaleOrder} = usePurchaseResaleOrder(signer);

	const gotoProfile = () => router.push(`/${profile.username}/portfolio`);

	const purchaseNFTAction = async () => {
		setPurchaseNFTPending(true);

		purchaseResaleOrder(
			Number(props.nft.id),
			amount,
			props.nft.price.value,
			props.nft.seller.address
		)
			.then((tx) => {
				setTx(tx.hash);
			})
			.catch((err) => {
				setPurchaseNFTPending(false);
				setPurchaseNFTError(err.reason ?? err.data?.message ?? err);
				console.log({err});
			});
	};

	useEffect(() => {
		if (data && isSuccess) {
			setPurchaseNFTPending(false);
			setPurchaseNFTSuccess(true);
		} else if (isError) {
			setPurchaseNFTPending(false);
			setPurchaseNFTError("Transaction failed");
		}
	}, [isError, data, isSuccess]);

	return (
		<>
			<GenericChainModal
				isOpen={purchaseNFTPending}
				noTitle
				subtitle={
					<Container className="flex flex-col items-center gap-4">
						<Spinner />
						<Text>
							<ImportantText>Purchasing NFT, please wait...</ImportantText>
						</Text>
					</Container>
				}
				hideClose
				noButton
				onClose={() => {
					props.onClose();
				}}
			/>

			<GenericChainModal
				isOpen={!purchaseNFTPending && purchaseNFTSuccess}
				title={"NFT Purchased ✅"}
				subtitle={"You have successfully purchased NFT."}
				hideClose
				buttonLabel="Go to profile"
				action={() => {
					gotoProfile();
				}}
				onClose={() => {
					gotoProfile();
				}}
			/>

			<GenericChainModal
				isOpen={!!purchaseNFTError}
				title={"An error occurred"}
				subtitle={
					<Container className="flex flex-col gap-4">
						<Text>
							An error occurred while purchasing your NFT. Please check your
							wallet balance and try again.
						</Text>
						<Container className="flex flex-col gap-2">
							<Heading size="xss">Full error description</Heading>
							<Container
								css={{
									backgroundColor: "$elementOnSurface",
								}}
								className="max-w-full p-2 rounded"
							>
								<Text
									css={{
										maxWidth: "100%",
										whiteSpace: "pre-wrap",
										lineBreak: "anywhere",
										fontFamily: "monospace !important",
									}}
								>
									{JSON.stringify(purchaseNFTError)}
								</Text>
							</Container>
						</Container>
					</Container>
				}
				hideClose
				buttonLabel="Dismiss"
				action={() => {
					props.onClose();
				}}
				onClose={() => {
					props.onClose();
				}}
			/>

			<GenericChainModal
				isOpen={
					props.isOpen &&
					!purchaseNFTPending &&
					!purchaseNFTSuccess &&
					!purchaseNFTError
				}
				title={"Purchase NFT"}
				subtitle={
					<Container className="flex flex-col gap-2 w-96">
						<Text>Are you sure you would you like to purchase:</Text>
						<Text
							className="px-4 py-2 my-2 rounded"
							css={{backgroundColor: "$elementOnSurface"}}
						>
							<span>
								1x <ImportantText>"{props.nft.name}"</ImportantText> for $
							</span>
							{props.nft.price.value} BNB?
						</Text>
					</Container>
				}
				onClose={() => {
					props.onClose();
				}}
				hideClose
				noButton
			>
				<Container className="flex flex-col gap-8">
					<Container className="flex justify-end gap-4">
						<Button
							appearance={"surface"}
							onClick={props.onClose}
						>
							Cancel
						</Button>
						<Button
							appearance={"action"}
							onClick={purchaseNFTAction}
						>
							Purchase
						</Button>
					</Container>
				</Container>
			</GenericChainModal>
		</>
	);
}
