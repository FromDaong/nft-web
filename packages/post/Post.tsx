import {TritPost} from "./TritPost";
import {SubscriptionContentPost} from "./SubscriptionContentPost";
import {TritPostProps} from "./types";

export default function Trit(post: TritPostProps) {
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
