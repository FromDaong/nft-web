/* eslint-disable no-mixed-spaces-and-tabs */
import {pagePropsConnectMongoDB} from "@db/engine/pagePropsDB";
import Error404 from "@packages/error/404";
import {
	MongoModelEvent,
	MongoModelNFT,
	MongoModelProfile,
	MongoModelTransaction,
} from "server/helpers/models";

const fetchNFTData = async (
	nftMongoId: string,
	seller: string,
	eventId: string
): Promise<{
	notFound: boolean;
	id?: string;
	mints?: Array<any>;
	nft?: any;
	seller?: any;
	isResale?: boolean;
	event?: any;
}> => {
	const eid = eventId;

	await pagePropsConnectMongoDB();

	if (!nftMongoId) {
		return {
			notFound: true,
		};
	}

	const nft = await MongoModelNFT.findById(nftMongoId)
		.populate("creator")
		.exec();

	if (!nft) {
		return {
			notFound: true,
		};
	}

	const creator = await MongoModelNFT.populate(nft.creator, {
		path: "profile",
		model: MongoModelProfile,
	});

	const seller_profile = seller
		? await MongoModelProfile.findOne({
				address: seller?.toLowerCase(),
		  })
		: null;

	const event = eid ? await MongoModelEvent.findById(eid) : null;

	if (!nft) {
		return {
			notFound: true,
		};
	}

	await MongoModelNFT.findByIdAndUpdate(nftMongoId, {
		$push: {
			views: "temporary",
		},
	});

	const transactions = await MongoModelTransaction.find({
		"metadata.nftId": nft.id,
	});

	nft.creator = creator;

	const returnObj = {
		id: nft.id,
		mints: transactions,
		nft: nft,
		seller: seller_profile,
		isResale: !!seller,
		event: event,
	};

	return {
		...returnObj,
		notFound: false,
	};
};

export default async function NFT({
	params,
	searchParams,
}: {
	params: {_id: string};
	searchParams: {eid: string; seller: string};
}) {
	const nftData = await fetchNFTData(
		params._id,
		searchParams.seller,
		searchParams.eid
	);
	const {nft, seller, notFound} = nftData;

	if (notFound) {
		return <Error404 />;
	}

	console.log({nftData});

	return <div>{JSON.stringify(nftData)}</div>;
}
