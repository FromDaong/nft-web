import {useBuyFromResale} from "@packages/post/hooks";
import {TritPostProps} from "@packages/post/types";
import {Container} from "@packages/shared/components/Container";
import {Text} from "@packages/shared/components/Typography/Headings";
import {ImportantText} from "@packages/shared/components/Typography/Text";
import {BigNumber, ethers} from "ethers";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useWaitForTransaction} from "wagmi";
import GenericChainModal from "./GenericChainModal";

export default function PurchaseResaleNFTModal(props: {
	onClose: any;
	isOpen: any;
	nft: TritPostProps;
}) {
	const [loading, setLoading] = useState(false);
	const [err, setError] = useState("");
	const [tx, setTx] = useState("");
	const router = useRouter();
	const session = useSession();

	const {buyFromResale} = useBuyFromResale();

	const cost = props.nft.price;

	const {data, isLoading} = useWaitForTransaction({
		hash: tx,
	});

	useEffect(() => {
		setLoading(false);
		setError("");
	}, []);

	const purchaseNFT = async () => {
		setLoading(true);
		setError("");
		buyFromResale(
			props.nft.id,
			1,
			props.nft.author.address,
			props.nft.price
		)
			.then((t) => {
				setTx(t.hash);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
				setError(err.data.message);
			});
	};

	useEffect(() => {
		if (data && isLoading) {
			setLoading(false);
		}
	}, [data]);

	return (
		<>
			<GenericChainModal
				title={
					!isLoading && !loading ? "Purchase NFT 🛒" : "Transaction pending"
				}
				onClose={props.onClose}
				isOpen={props.isOpen}
				buttonLabel={!data ? "Purchase NFT" : "Go to portfolio"}
				action={
					!data ? purchaseNFT : () => router.push(`/${session}/collected`)
				}
				loading={loading}
			>
				<Container className="flex flex-col gap-4">
					{!data && !loading && (
						<Text>
							You are buying the NFT{" "}
							<ImportantText>{props.nft.name}</ImportantText> for{" "}
							<ImportantText>{props.nft.price.value}</ImportantText>  BNB from the Resale Market
						</Text>
					)}
					{!data && (loading || isLoading) && (
						<Text>
							You will be taken to the next step automagically when your
							purchase has been confirmed on the blockchain.
						</Text>
					)}
					{err && !data && <Text appearance="danger">{err}</Text>}
				</Container>
			</GenericChainModal>
		</>
	);
}
