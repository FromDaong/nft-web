import {TritPost} from "./TritPost";
import {SubscriptionContentPost} from "./SubscriptionContentPost";
import {TritPostProps} from "./types";

export default function Treat(post: TritPostProps) {
	return (
		<>
			{post.post_type === "subscription" ? (
				<SubscriptionContentPost {...post} />
			) : (
				<TritPost {...post} />
			)}
		</>
	);
}
