import {useUser} from "core/auth/useUser";
import {CollectionsPresentation} from ".";

export const StudioCollectionsPresentation = () => {
	// fetch nfts from /api/v3/marketplace/collections/
	// store them as collections
	// use react-query
	const {creator} = useUser();

	if (!creator) return null;

	return (
		<CollectionsPresentation
			creator_id={creator._id}
			base_url={"/collection"}
		/>
	);
};
