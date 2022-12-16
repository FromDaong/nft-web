import {LivestreamingPostCard} from "@packages/post/Livestreaming";
import {SubscriptionContentPost} from "@packages/post/SubscriptionContentPost";
import {TritPostProps} from "@packages/post/types";
import {SEOHead} from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";

const newCurated: TritPostProps = {
	name: "Welcome to the Tritters",
	text: "Woke up feeling sexy :)",
	price: {
		value: 0.99,
		currency: "BNB",
	},
	id: "1",
	blurhash:
		"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
	post_type: "subscription",
	author: {
		username: "kamfeskaya",
		display_name: "Kamfes",
		avatar:
			"https://images.pexels.com/users/avatars/50964441/feyza-yildirim-157.jpeg?auto=compress&fit=crop&h=50&w=50&dpr=1",
	},
	timestamp: 782898893,
	subscription: {
		id: "8373",
		price: {
			value: 0.2,
			currency: "BNB",
		},
	},
};

export default function LivePage() {
	return (
		<ApplicationLayout>
			<SEOHead title="Subscribed - Trit" />
			<ApplicationFrame>
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<div
						key={i}
						className="col-span-1"
					>
						<LivestreamingPostCard {...newCurated} />
					</div>
				))}
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
