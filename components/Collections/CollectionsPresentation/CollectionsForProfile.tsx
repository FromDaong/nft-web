import {CollectionsPresentation} from ".";

export const MarketplaceCollectionsPresentation = ({user_id, username}) => {
	// fetch nfts from /api/v3/marketplace/collections/
	// store them as collections
	// use react-query

	return (
		<CollectionsPresentation
			creator_id={user_id}
			base_url={"/collection"}
		/>
	);
};
