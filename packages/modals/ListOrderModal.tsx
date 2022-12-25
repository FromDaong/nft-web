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
import {MutedText} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {BigNumber, ethers} from "ethers";
import {useState} from "react";
import GenericChainModal from "./GenericChainModal";

export default function ListOrderModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const {isOpen, onOpen, onClose} = useDisclosure();
	const [approveLoading, setApproveLoading] = useState(false);
	const [listOrderPending, setListOrderPending] = useState(false);
	const [listPrice, setListPrice] = useState(0);
	const [listQuantity, setListQuantity] = useState(1);
	const maxUnixTimestamp = 2147483647;
	const [listExpires] = useState(maxUnixTimestamp);

	const isApprovedForAll = useGetMinterIsApprovedForAll();
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

	if (!isApprovedForAll && !isOpen) {
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
			listPrice,
			listExpires ?? maxUnixTimestamp
		)
			.then(() => {
				setListOrderPending(false);
			})
			.catch((err) => {
				setListOrderPending(false);
				console.log({err});
			});
	};

	return (
		<>
			<GenericChainModal
				title={"List NFT on Marketplace"}
				onClose={props.onClose}
				isOpen={props.isOpen}
				subtitle={`NFT name: ${props.nft.name}`}
				buttonLabel={"Continue"}
				hideClose
				noButton
			>
				<GenericChainModal
					isOpen={isOpen}
					title={"Approve the Treat Marketplace"}
					subtitle={
						"In order to use the Treat resale marketplace, you must approve our smart contract on your wallet. The smart contract code is publicly available to view. Once complete, wait a few minutes for the transaction to confirm."
					}
					buttonLabel={"Approve in Wallet"}
					action={approveAction}
					onClose={onClose}
					loading={approveLoading}
				/>

				<GenericChainModal
					isOpen={listOrderPending}
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
				<Container>
					<Container>
						<Text>List Price in BNB</Text>
						<Input
							type="number"
							onChange={(e) => setListPrice(Number(e.currentTarget.value))}
							placeholder="0"
						/>
						<MutedText>This is the price for someone to buy your NFT</MutedText>
					</Container>
					<Container>
						<MutedText>
							Floor price: {ethers.utils.formatEther(lowestOpenOrder)}
						</MutedText>
					</Container>
					{parseInt(balance) > 1 && (
						<Container>
							<Text>Quantity</Text>
							<Input
								type="number"
								value={listQuantity}
								min={1}
								onChange={(e) => setListQuantity(Number(e.target.value))}
								placeholder="1"
							/>
							<MutedText>
								NFTs are sold out individually, at the list price. Choose the
								amount you wish to list.
							</MutedText>
						</Container>
					)}
					<div className="row">
						<div className="col-md-6">
							<Button
								type="submit"
								className="px-8 py-3"
								onClick={listOrderAction}
							>
								{listOrderPending ? (
									<>
										<Spinner />
										<span>Submit</span>
									</>
								) : (
									"Submitting..."
								)}
							</Button>
						</div>
						<div className="col-md-6">
							<Button
								className="font-bold text-white bg-primary"
								onClick={() => null}
							>
								Cancel
							</Button>
						</div>
					</div>
				</Container>
			</GenericChainModal>
		</>
	);
}
