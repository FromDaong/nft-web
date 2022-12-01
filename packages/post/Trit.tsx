import {CuratedNFt} from "./CuratedPost";
import {SubscriptionContentPost} from "./SubscriptionContentPost";
import {TPost} from "./types";

export default function Trit(post: TPost) {
	return (
		<>
			{post.post_type === "subscription" ? (
				<SubscriptionContentPost {...post} />
			) : (
				<CuratedNFt {...post} />
			)}
		</>
	);
}
