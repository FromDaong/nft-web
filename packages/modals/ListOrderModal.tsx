import {useDisclosure} from "@packages/hooks";
import {
	useApproveMarketplace,
	useGetMinterIsApprovedForAll,
	useGetRemainingOrderBalance,
	useGetResaleOrders,
	useListOrder,
} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {Input} from "@packages/shared/components/Input";
import {Text} from "@packages/shared/components/Typography/Headings";
import {
	ImportantText,
	MutedText,
	SmallText,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import {BigNumber, ethers} from "ethers";
import {useRouter} from "next/router";
import {useState} from "react";
import {useAccount, useWaitForTransaction} from "wagmi";
import Web3 from "web3";
import GenericChainModal from "./GenericChainModal";

export default function ListOrderModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const router = useRouter();
	const {address} = useAccount();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [listOrderPending, setListOrderPending] = useState(false);
	const [listOrderSuccess, setListOrderSuccess] = useState(false);
	const [listOrderError, setListOrderError] = useState(false);
	const [listPrice, setListPrice] = useState(0);
	const [listQuantity, setListQuantity] = useState(1);

	const [isApproved, isApprovedLoading] = useGetMinterIsApprovedForAll();

	const {listOrder} = useListOrder();
	const openOrders = useGetResaleOrders(props.nft.id) ?? [];
	const balance = useGetRemainingOrderBalance(props.nft.id);

	const [approveTx, setApproveTx] = useState<any>(null);
	const {isLoading: isApprovalLoading} = useWaitForTransaction({
		hash: approveTx,
	});
	const {approveMarketplace} = useApproveMarketplace();

	const lowestOpenOrder = BigNumber.from(
		openOrders.reduce(
			(lowest, order) => (lowest.price < order.price ? lowest : order),
			{price: 0}
		).price
	);

	if (!isApproved && !isOpen) {
		onOpen();
	}

	const approveAction = () => {
		approveMarketplace()
			.then((res) => {
				setApproveTx(res.hash);
			})
			.then(() => onClose())
			.catch((err) => {
				console.log({err});
			});
	};

	const listOrderAction = async () => {
		setListOrderPending(true);

		listOrder(
			props.nft.id,
			Web3.utils.toWei(listPrice.toString()),
			listQuantity
		)
			.then(() => {
				return axios.post(`${apiEndpoint}/marketplace/methods/add-new-event`, {
					id: props.nft.id,
					price: listPrice.toString(),
					seller: address,
				});
			})
			.then(() => {
				setListOrderPending(false);
				setListOrderSuccess(true);
			})
			.catch((err) => {
				setListOrderPending(false);
				setListOrderError(err);
				console.log({err});
			});
	};

	return (
		<>
			{!isApprovalLoading ||
				(isApprovedLoading && (
					<GenericChainModal
						isOpen={!isApproved}
						title={"Approve the Treat Marketplace"}
						subtitle={
							"In order to use the Treat resale marketplace, you must approve our smart contract on your wallet. The smart contract code is publicly available to view. Once complete, wait a few minutes for the transaction to confirm."
						}
						buttonLabel={"Approve in Wallet"}
						action={approveAction}
						onClose={() => {
							onClose();
							props.onClose();
						}}
						loading={isApprovalLoading}
					/>
				))}

			<GenericChainModal
				isOpen={isApprovalLoading || isApprovedLoading}
				title={"Approving Treat Marketplace"}
				loading
				subtitle={
					"Checking if you have approved the Treat Marketplace Contract."
				}
				hideClose
				noButton
				onClose={() => {
					onClose();
					props.onClose();
				}}
			/>

			<GenericChainModal
				isOpen={listOrderPending}
				loading
				title={"Listing your NFT"}
				subtitle={"Please wait, we are listing your NFT on the marketplace."}
				hideClose
				noButton
				onClose={() => {
					onClose();
					props.onClose();
				}}
			/>

			<GenericChainModal
				isOpen={!listOrderPending && listOrderSuccess}
				subtitle={"Your NFT has been listed on the Resale Marketplace."}
				hideClose
				buttonLabel="Close"
				action={() => {
					onClose();
					router.reload();
				}}
				onClose={() => {
					onClose();
					router.reload();
				}}
			/>

			<GenericChainModal
				isOpen={!!listOrderError}
				title={"An error occurred"}
				subtitle={
					"An error occurred while listing your NFT for resale. Please try again."
				}
				hideClose
				buttonLabel="Close"
				action={() => {
					onClose();
					props.onClose();
				}}
				onClose={() => {
					onClose();
					props.onClose();
				}}
			/>

			{!isApprovedLoading && (
				<>
					{!listOrderPending &&
						!listOrderSuccess &&
						!listOrderError &&
						isApproved && (
							<GenericChainModal
								title={"List NFT on Marketplace"}
								onClose={props.onClose}
								isOpen={props.isOpen}
								subtitle={`NFT name: ${props.nft.name}`}
								buttonLabel={"Continue"}
								hideClose
								noButton
							>
								<Container>
									<Container>
										<Text>
											<ImportantText>List Price in BNB</ImportantText>
										</Text>
										<Input
											type="number"
											onChange={(e) =>
												setListPrice(Number(e.currentTarget.value))
											}
											placeholder="0.001"
											min={0.001}
											step={0.001}
											appearance={"solid"}
										/>
										<MutedText>
											<SmallText>
												This is the price for someone to buy your NFT
											</SmallText>
										</MutedText>
									</Container>
									<Container className="my-4">
										<Text>
											<ImportantText>
												Floor price: {ethers.utils.formatEther(lowestOpenOrder)}
											</ImportantText>
										</Text>
									</Container>
									{parseInt(balance) > 1 && (
										<Container>
											<Text>Quantity</Text>
											<Input
												type="number"
												value={listQuantity}
												min={1}
												onChange={(e) =>
													setListQuantity(Number(e.target.value))
												}
												placeholder="1"
												appearance={"solid"}
											/>
											<MutedText>
												NFTs are sold out individually, at the list price.
												Choose the amount you wish to list.
											</MutedText>
										</Container>
									)}
									<div className="flex justify-end gap-4">
										<Button
											className="font-bold "
											onClick={props.onClose}
											appearance={"surface"}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											className="px-8 py-3"
											onClick={listOrderAction}
											appearance={listOrderPending ? "loading" : "action"}
										>
											{listOrderPending ? (
												<>
													<Spinner />
												</>
											) : (
												"List order"
											)}
										</Button>
									</div>
								</Container>
							</GenericChainModal>
						)}
				</>
			)}
		</>
	);
}
