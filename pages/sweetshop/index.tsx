import SweetshopSortBy from "@packages/post/SweetshopSortBy";
import {TritPost} from "@packages/post/TritPost";
import {TPost} from "@packages/post/types";
import {SEOHead} from "@packages/seo/page";
import {Container} from "@packages/shared/components/Container";
import {Divider} from "@packages/shared/components/Divider";
import SelectableTag from "@packages/shared/components/Selectabletag";
import {Heading} from "@packages/shared/components/Typography/Headings";
import {
	BoldLink,
	DisabledLink,
	Text,
} from "@packages/shared/components/Typography/Text";
import ApplicationFrame from "core/components/layouts/ApplicationFrame";
import ApplicationLayout from "core/components/layouts/ApplicationLayout";
import Link from "next/link";
import NFTDropdownSort from "packages/navigation/components/NFTDropdownFilter";
import {InfinityScrollListing} from "packages/shared/components/ListingSection";

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

export default function NFTS() {
	return (
		<ApplicationLayout>
			<ApplicationFrame>
				<SEOHead title="Explore NFTs" />
				<Container className="flex flex-col gap-12 py-12">
					<Container className="flex flex-col px-4 xl:px-0">
						<Heading size="md">Browse sweetshop trits</Heading>
						<Divider dir="horizontal" />
						<Container>
							<Container className="flex flex-col md:flex-row gap-4 md:justify-between">
								<Container className="flex gap-2">
									<SelectableTag>
										<Text>Free</Text>
									</SelectableTag>
									<SelectableTag>
										<Text>Sold out</Text>
									</SelectableTag>
									<SelectableTag>
										<Text>1 of 1</Text>
									</SelectableTag>
									<SelectableTag>
										<Text>TOTM</Text>
									</SelectableTag>
								</Container>
								<Container className="flex gap-4">
									<SweetshopSortBy />
								</Container>
							</Container>
							<Divider dir="horizontal" />
						</Container>
					</Container>

					<Container className="px-4 xl:px-0">
						<InfinityScrollListing>
							{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
								<div
									key={i}
									className="col-span-1"
								>
									<TritPost
										inGrid
										{...newCurated}
									/>
								</div>
							))}
						</InfinityScrollListing>
					</Container>
				</Container>
			</ApplicationFrame>
		</ApplicationLayout>
	);
}
