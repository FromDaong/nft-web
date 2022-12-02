import {CuratedNFt} from "@packages/post/CuratedPost";
import {TPost} from "@packages/post/types";
import {SEOHead} from "@packages/seo/page";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import ProfileLayout from "core/components/layouts/ProfileLayout";
import {useRouter} from "next/router";

const newCurated: TPost = {
	name: "Welcome to the Tritters",
	collection: {
		name: "Tritters",
		totalSupply: 10,
		minted: 4,
		avatar: "/assets/cherieCover.jpg",
	},
	/*image: {
    cdn: "/assets/cherieCover.jpg",
    ipfs: "/assets/cherieCover.jpg",
  },*/
	price: {
		value: 0.99,
		currency: "BNB",
	},
	id: "1",
	blurhash:
		"-qIFGCoMs:WBayay_NRjayj[ayj[IUWBayayj[fQIUt7j[ayayayj@WBRjoffkj[xuWBWCayj[ayWAt7fQj[ayayM{WBofj[j[fQ",
	post_type: "colletible",
	author: {
		username: "kamfeskaya",
		display_name: "Kamfes",
		avatar:
			"https://images.pexels.com/users/avatars/50964441/feyza-yildirim-157.jpeg?auto=compress&fit=crop&h=50&w=50&dpr=1",
	},
	timestamp: 782898893,
};

export default function UserProfile() {
	const router = useRouter();
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<ProfileLayout>
					<SEOHead title={router.query.username + " - Trit"} />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<CuratedNFt {...newCurated} />
						<CuratedNFt {...newCurated} />
						<CuratedNFt {...newCurated} />
					</div>
				</ProfileLayout>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
