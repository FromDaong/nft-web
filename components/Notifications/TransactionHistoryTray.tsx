import {treatGraphClient} from "@lib/graphClients";
import {Modal, ModalHeaderSection} from "@packages/modals";
import {Button} from "@packages/shared/components/Button";
import {Container} from "@packages/shared/components/Container";
import {
	ImportantText,
	MutedText,
	Text,
} from "@packages/shared/components/Typography/Text";
import Spinner from "@packages/shared/icons/Spinner";
import {timeFromNow} from "@utils/index";
import {ExternalLink} from "lucide-react";
import {Provider, gql, useQuery} from "urql";
import {useAccount} from "wagmi";

export default function TransactionHistoryTray({isOpen, onClose}) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<Container>
				<ModalHeaderSection
					title={"Recent NFT transfers"}
					onClose={onClose}
				/>
				<Provider value={treatGraphClient}>
					<Container
						className="flex flex-col gap-4 p-4"
						css={{background: "$surfaceOnSurface"}}
					>
						<TransactionsContainer />
						<Container>
							<MutedText>
								<ImportantText>
									Your recent activity on the TreatDAO platform will be shown
									here
								</ImportantText>
							</MutedText>
						</Container>
					</Container>
				</Provider>
			</Container>
		</Modal>
	);
}

const TransactionsContainer = () => {
	const {address} = useAccount();
	const sendingTx = () => gql`
		query getTransfers($address: String!) {
			transfers(where: {from_contains_nocase: $address}) {
				id
				timestamp
				value
				from {
					id
				}
				to {
					id
				}
				transaction {
					id
				}
			}
		}
	`;

	const receivingTx = () => gql`
		query getTransfers($address: String!) {
			transfers(where: {from_contains_nocase: $address}) {
				id
				timestamp
				value
				from {
					id
				}
				to {
					id
				}
				transaction {
					id
				}
			}
		}
	`;

	const [receivingResult] = useQuery({
		query: receivingTx(),
		variables: {address},
	});
	const [sendingResult] = useQuery({
		query: sendingTx(),
		variables: {address},
	});

	const {data, fetching, error} = receivingResult;
	const {
		data: sendingData,
		fetching: sendingFetching,
		error: sendingError,
	} = sendingResult;

	if (!data || !sendingData)
		return (
			<Container className="flex justify-center">
				<Spinner />
			</Container>
		);

	const transfers = [
		...data?.transfers.map((t) => ({...t, type: "received"})),
		...sendingData?.transfers.map((t) => ({...t, type: "sent"})),
	].sort((a, b) => {
		return b.timestamp - a.timestamp;
	});

	return (
		<Container className="flex flex-col gap-1 overflow-y-auto">
			{!fetching &&
				transfers.slice(0, 5).map((transfer) => (
					<TransactionHistoryItem
						key={transfer.id}
						{...transfer}
					/>
				))}
		</Container>
	);
};

export const formatAddress = (address) => {
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const TransactionHistoryItem = ({
	timestamp,
	value,
	from,
	to,
	type,
	id,
	transaction,
}) => {
	return (
		<a
			href={`https://bscscan.com/tx/${transaction.id}`}
			target={"_blank"}
			rel={"noreferrer"}
		>
			<Container
				className="p-2 rounded-xl transition-all duration-200"
				css={{
					"&:hover": {
						background: "$elementOnSurface",
					},
				}}
			>
				<Container className="flex flex-col gap-1">
					<Container className="flex flex-row justify-between">
						<Container className="flex flex-row gap-4">
							<Container className="flex flex-col gap-1">
								<Text css={{color: "$textContrast"}}>
									<ImportantText>
										<ImportantText className="capitalize">{type}</ImportantText>{" "}
										{value} NFT
										{value > 1 && "s"} {type === "sent" ? "to" : "from"}{" "}
										{formatAddress(to.id)}
									</ImportantText>
								</Text>
								<Text className="capitalize">
									{timeFromNow(new Date(timestamp * 1000).toLocaleString())}
								</Text>
							</Container>
						</Container>
						<Container className="flex flex-row gap-1">
							<Button
								css={{padding: "8px"}}
								appearance={"unstyled"}
							>
								<Text>
									<ExternalLink className="w-5 h-5" />
								</Text>
							</Button>
						</Container>
					</Container>
				</Container>
			</Container>
		</a>
	);
};
