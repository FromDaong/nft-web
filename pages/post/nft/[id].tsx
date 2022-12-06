import {connectMongoDB} from "@db/engine";
import LegacyNFTModel from "@db/legacy/nft/NFT";
import ModelTransaction from "@db/models/transaction";
import Error404 from "@packages/error/404";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

export default function NFT(props: {notFound?: boolean; data: any}) {
	if (props.notFound) {
		return <Error404 />;
	}

	const data = JSON.parse(props.data);
	console.log({data});

	return (
		<>
			<ApplicationLayout>
				<ApplicationFrame></ApplicationFrame>
			</ApplicationLayout>
		</>
	);
}

export const getServerSideProps = async (context) => {
	const {id} = context.params;

	await connectMongoDB();

	const nft = await LegacyNFTModel.findOne({id});

	if (!nft) {
		return {
			notFound: true,
		};
	}

	const transactions = await ModelTransaction.find({
		metadata: {
			nftId: id,
		},
	});

	const returnObj = {
		id,
		mints: transactions,
		nft: nft,
	};

	return {
		props: {
			data: JSON.stringify(returnObj),
		},
	};
};
