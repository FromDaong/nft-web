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
import {BigNumber, ethers} from "ethers";
import {useState} from "react";
import Web3 from "web3";
import GenericChainModal from "./GenericChainModal";

export default function ListOrderModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [approveLoading, setApproveLoading] = useState(false);
	const [listOrderPending, setListOrderPending] = useState(false);
	const [listOrderSuccess, setListOrderSuccess] = useState(false);
	const [listOrderError, setListOrderError] = useState(false);
	const [listPrice, setListPrice] = useState(0);
	const [listQuantity, setListQuantity] = useState(1);
	const maxUnixTimestamp = 2147483647;
	const [listExpires] = useState(maxUnixTimestamp);

	const [isApproved, isApprovedLoading] = useGetMinterIsApprovedForAll();

	const {listOrder} = useListOrder();
	const openOrders = useGetResaleOrders(props.nft.id) ?? [];
	const balance = useGetRemainingOrderBalance(props.nft.id);

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
		setApproveLoading(true);
		approveMarketplace()
			.then(() => setApproveLoading(false))
			.then(() => onClose())
			.catch((err) => {
				console.log({err});
			});
	};

	const listOrderAction = async () => {
		listOrder(
			props.nft.id,
			listQuantity,
			Web3.utils.toWei(listPrice),
			listExpires ?? maxUnixTimestamp
		)
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
				loading={approveLoading}
			/>

			<GenericChainModal
				isOpen={isApprovedLoading}
				noTitle
				subtitle={
					<Container className="flex flex-col items-center gap-4">
						<Spinner />
						<Text>
							<ImportantText>
								Checking if you have approved the Treat Marketplace Contract.
							</ImportantText>
						</Text>
					</Container>
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
				noTitle
				subtitle={
					<Container className="flex flex-col items-center gap-4">
						<Spinner />
						<Text>
							<ImportantText>
								Please wait, we are listing your NFT on the marketplace.
							</ImportantText>
						</Text>
					</Container>
				}
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
					props.onClose();
				}}
				onClose={() => {
					onClose();
					props.onClose();
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
											/>
											<MutedText>
												NFTs are sold out individually, at the list price.
												Choose the amount you wish to list.
											</MutedText>
										</Container>
									)}
									<div className="flex justify-end gap-4">
										<Button
											className="font-bold text-white bg-primary"
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
													<span>Submit</span>
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
