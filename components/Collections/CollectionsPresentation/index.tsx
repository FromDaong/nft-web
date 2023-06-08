import NFTCollection from "@components/CreatorDashboard/NFTCollection";
import {Container} from "@packages/shared/components/Container";
import axios from "axios";
import TreatCore from "core/TreatCore";

export const CollectionsPresentation = ({creator_id, base_url}) => {
	// fetch nfts from /api/v3/marketplace/collections/
	// store them as collections
	// use react-query
	const {
		data: collections,
		isLoading,
		isError,
		error,
	} = TreatCore.useQuery([`collections:${creator_id}`], async () => {
		const {data} = await axios.get(
			`${process.env.NEXT_PUBLIC_HOSTNAME}/api/v3/marketplace/collection/seller/${creator_id}`
		);
		return data.data.map((item) => ({
			name: item.name,
			cover_image: item.cover_image ?? "/assets/bg.jpg",
			creator: item.creator,
			href: item._id,
			nfts: item.nfts,
		}));
	});

	return (
		<Container className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			{!isLoading &&
				!isError &&
				collections.map((item) => (
					<NFTCollection
						item={{...item, href: `${base_url}/${item.href}`}}
						key={item.href}
					/>
				))}
		</Container>
	);
};
