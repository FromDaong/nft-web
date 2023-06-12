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
import {toast} from "sonner";

export default function RemoveListingModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const router = useRouter();
	const {address} = useAccount();
	const [removeOrderPending, setListOrderPending] = useState(false);
	const [removeOrderSuccess, setRemoveOrderSuccess] = useState(false);
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
				toast.success("Your NFT has been removed from the Resale Marketplace.");
				setRemoveOrderSuccess(true);
			})
			.catch((err) => {
				setListOrderError(err);
				toast.error(
					"An error occurred while removing your NFT from the Resale Marketplace."
				);
			})
			.finally(() => {
				setListOrderPending(false);
			});
	};

	return (
		<>
			<GenericChainModal
				isOpen={removeOrderPending}
				title={"Remove listing"}
				loading
				subtitle={
					"Please wait, we are removing your NFT from the Resale Marketplace."
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
				subtitle={"Oops. We hit an obstacle"}
				hideClose
				noButton
				buttonLabel="Close"
				action={() => {
					props.onClose();
				}}
				onClose={() => {
					props.onClose();
				}}
			>
				<Text>
					An error occurred while removing your NFT from the Resale Marketplace.
					Please try again.
				</Text>
			</GenericChainModal>

			<GenericChainModal
				isOpen={
					props.isOpen &&
					!removeOrderPending &&
					!removeOrderSuccess &&
					!removeOrderError
				}
				title={"Remove resale listing"}
				subtitle={"Are you sure you want to remove this listing?"}
				buttonLabel="Remove listing"
				buttonAppearance={"danger"}
				action={removeOrderAction}
				onClose={() => {
					props.onClose();
				}}
			>
				<Text>
					Remove your NFT from the marketplace. Your NFT will stop showing in
					results on the sweetshop and will no longer be buyable from the
					marketplace.
				</Text>
			</GenericChainModal>
		</>
	);
}
