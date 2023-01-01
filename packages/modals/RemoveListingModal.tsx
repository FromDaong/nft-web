import {useRemoveOrder} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {apiEndpoint} from "@utils/index";
import axios from "axios";
import {useRouter} from "next/router";
import {useState} from "react";
import {useAccount} from "wagmi";
import GenericChainModal from "./GenericChainModal";

export default function RemoveListingModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const router = useRouter();
	const {address} = useAccount();
	const [removeOrderPending, setListOrderPending] = useState(false);
	const [removeOrderSuccess, setListOrderSuccess] = useState(false);
	const [removeOrderError, setListOrderError] = useState(false);

	const {removeOrder} = useRemoveOrder();

	const removeOrderAction = async () => {
		setListOrderPending(true);

		removeOrder(props.nft.id)
			.then(() => {
				return axios.post(`${apiEndpoint}/marketplace/methods/remove-event`, {
					id: props.nft.id,
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
			<GenericChainModal
				isOpen={removeOrderPending}
				noTitle
				subtitle={
					<Container className="flex flex-col items-center gap-4">
						<Spinner />
						<Text>
							<ImportantText>
								Please wait, we are removing your NFT from the marketplace.
							</ImportantText>
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
				isOpen={!removeOrderPending && removeOrderSuccess}
				subtitle={"Your NFT has been removed from the Resale Marketplace."}
				hideClose
				buttonLabel="Close"
				noButton
				action={() => {
					router.reload();
				}}
				onClose={() => {
					router.reload();
				}}
			/>

			<GenericChainModal
				isOpen={!!removeOrderError}
				title={"An error occurred"}
				subtitle={
					"An error occurred while removing your NFT from resale. Please try again."
				}
				hideClose
				noButton
				buttonLabel="Close"
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
					!removeOrderPending &&
					!removeOrderSuccess &&
					!removeOrderError
				}
				title={"Remove resale listing"}
				subtitle={
					"Remove your NFT from the marketplace. Your NFT will stop showing in results on the sweetshop and will no longer be buyable from the marketplace."
				}
				buttonLabel="Remove listing"
				action={removeOrderAction}
				onClose={() => {
					props.onClose();
				}}
			/>
		</>
	);
}
